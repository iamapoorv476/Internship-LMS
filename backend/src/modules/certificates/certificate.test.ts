import request from "supertest";
import app from "../../app";
import { supabase } from "../../config/supabase";
import { signToken } from "../../config/jwt";

const uniqueEmail = (prefix: string) =>
  `${prefix}-${Date.now()}@test.com`;

describe("Certificate Generation", () => {
  let token: string;
  let courseId: string;
  let studentId: string;

  beforeAll(async () => {
    const { data: student } = await supabase
      .from("users")
      .insert({
       email: uniqueEmail("certificate"),
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
        title: "Cert Course",
        mentor_id: studentId
      })
      .select()
      .single();

    courseId = course.id;
  });

  it("blocks certificate before completion", async () => {
    const res = await request(app)
      .get(`/api/certificates/${courseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Course not assigned");
  });
});
