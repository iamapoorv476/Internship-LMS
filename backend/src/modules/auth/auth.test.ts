import request from "supertest";
import app from "../../app";
import { supabase } from "../../config/supabase";

describe("Auth Module", () => {
  const studentEmail = "student@test.com";
  const password = "password123";

  afterAll(async () => {
    await supabase.from("users").delete().eq("email", studentEmail);
  });

  it("should register a student", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: studentEmail, password });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Student registered successfully");
  });

  it("should login a student", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: studentEmail, password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should not login unapproved mentor", async () => {
    await supabase.from("users").insert({
      email: "mentor@test.com",
      password_hash: "dummy",
      role: "mentor",
      is_approved: false
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "mentor@test.com", password: "password123" });

    expect(res.status).toBe(403);
  });
});
