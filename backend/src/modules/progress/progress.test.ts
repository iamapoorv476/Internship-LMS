import request from "supertest";
import app from "../../app";
import { supabase } from "../../config/supabase";
import { signToken } from "../../config/jwt";

const uniqueEmail = (prefix: string) =>
  `${prefix}-${Date.now()}@test.com`;

describe("Student Progress", () => {
  let studentId: string;
  let token: string;
  let courseId: string;
  let chapter1: string;
  let chapter2: string;

  beforeAll(async () => {
    const { data: student, error: studentError } = await supabase
      .from("users")
      .insert({
        email: uniqueEmail("progress"),
        password_hash: "hashed",
        role: "student",
        is_approved: true
      })
      .select()
      .single();

  if (studentError) {
  console.error(studentError);
  throw studentError;
}
if (!student) {
  throw new Error("Student insert returned null");
}

    studentId = student.id;
    token = signToken({ userId: studentId, role: "student" });
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .insert({
        title: "Test Course",
        mentor_id: studentId
      })
      .select()
      .single();

    if (courseError || !course) {
      throw new Error("Failed to create test course");
    }

    courseId = course.id;
    const { data: ch1 } = await supabase
      .from("chapters")
      .insert({
        course_id: courseId,
        title: "Chapter 1",
        description: "",
        sequence_order: 1
      })
      .select()
      .single();

    const { data: ch2 } = await supabase
      .from("chapters")
      .insert({
        course_id: courseId,
        title: "Chapter 2",
        description: "",
        sequence_order: 2
      })
      .select()
      .single();

    if (!ch1 || !ch2) {
      throw new Error("Failed to create chapters");
    }

    chapter1 = ch1.id;
    chapter2 = ch2.id;
    await supabase.from("course_assignments").insert({
      course_id: courseId,
      student_id: studentId
    });
  });

  afterAll(async () => {
    await supabase.from("progress").delete().eq("student_id", studentId);
    await supabase.from("course_assignments").delete().eq("student_id", studentId);
    await supabase.from("chapters").delete().eq("course_id", courseId);
    await supabase.from("courses").delete().eq("id", courseId);
    await supabase.from("users").delete().eq("id", studentId);
  });

  it("prevents skipping chapters", async () => {
    const res = await request(app)
      .post(`/api/progress/${chapter2}/complete`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(
      "Chapters must be completed sequentially"
    );
  });

  it("allows sequential completion", async () => {
    const res = await request(app)
      .post(`/api/progress/${chapter1}/complete`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message.toLowerCase()).toContain("completed");
  });
});
