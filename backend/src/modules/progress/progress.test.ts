import request from "supertest";
import app from "../../app";
import { supabase } from "../../config/supabase";
import { signToken } from "../../config/jwt";

describe("Student Progress", () => {
  let studentId: string;
  let token: string;
  let chapter1: string;
  let chapter2: string;

  beforeAll(async () => {
    const { data: student } = await supabase
      .from("users")
      .insert({
        email: "progress@test.com",
        password_hash: "hashed",
        role: "student",
        is_approved: true
      })
      .select()
      .single();

    studentId = student.id;
    token = signToken({ userId: studentId, role: "student" });

    const { data: course } = await supabase
      .from("courses")
      .insert({
        title: "Test Course",
        mentor_id: studentId
      })
      .select()
      .single();

    const { data: ch1 } = await supabase
      .from("chapters")
      .insert({
        course_id: course.id,
        title: "Chapter 1",
        description: "",
        sequence_order: 1
      })
      .select()
      .single();

    const { data: ch2 } = await supabase
      .from("chapters")
      .insert({
        course_id: course.id,
        title: "Chapter 2",
        description: "",
        sequence_order: 2
      })
      .select()
      .single();

    chapter1 = ch1.id;
    chapter2 = ch2.id;

    await supabase.from("course_assignments").insert({
      course_id: course.id,
      student_id: studentId
    });
  });

  it("prevents skipping chapters", async () => {
    const res = await request(app)
      .post(`/api/progress/${chapter2}/complete`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it("allows sequential completion", async () => {
    const res = await request(app)
      .post(`/api/progress/${chapter1}/complete`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
