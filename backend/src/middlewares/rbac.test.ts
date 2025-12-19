import request from "supertest";
import app from "../app";
import { signToken } from "../config/jwt";

describe("RBAC Middleware", () => {
  it("returns 401 without token", async () => {
    const res = await request(app).get("/api/protected");
    expect(res.status).toBe(401);
  });

  it("returns 403 for forbidden role", async () => {
    const token = signToken({
      userId: "123",
      role: "student"
    });

    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});
