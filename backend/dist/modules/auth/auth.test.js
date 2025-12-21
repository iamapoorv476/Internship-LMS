"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const supabase_1 = require("../../config/supabase");
const uniqueEmail = (prefix) => `${prefix}-${Date.now()}@test.com`;
describe("Auth Module", () => {
    const studentEmail = "student@test.com";
    const password = "password123";
    afterAll(async () => {
        await supabase_1.supabase.from("users").delete().eq("email", studentEmail);
    });
    it("should register a student", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/register")
            .send({ email: studentEmail, password });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Student registered successfully");
    });
    it("should login a student", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email: studentEmail, password });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });
    it("should not login unapproved mentor", async () => {
        await supabase_1.supabase.from("users").insert({
            email: uniqueEmail("mentor"),
            password_hash: "dummy",
            role: "mentor",
            is_approved: false
        });
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email: "mentor@test.com", password: "password123" });
        expect(res.status).toBe(403);
    });
});
