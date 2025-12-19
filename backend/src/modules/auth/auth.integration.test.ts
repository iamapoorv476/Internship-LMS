import request from "supertest";
import app from "../../app";
import { supabase } from "../../config/supabase";

describe("Auth & RBAC", () => {
  const email = "student_test@test.com";
  const password = "password123";

  afterAll(async () => {
    await supabase.from("users").delete().eq("email", email);
  });

  it("registers a student", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password });

    expect(res.status).toBe(201);
  });

  it("logs in and returns JWT", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("blocks protected route without token", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(401);
  });
});
