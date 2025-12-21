"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const supabase_1 = require("../../config/supabase");
describe("Auth & RBAC", () => {
    const email = "student_test@test.com";
    const password = "password123";
    afterAll(async () => {
        await supabase_1.supabase.from("users").delete().eq("email", email);
    });
    it("registers a student", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/register")
            .send({ email, password });
        expect(res.status).toBe(201);
    });
    it("logs in and returns JWT", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email, password });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });
    it("blocks protected route without token", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/api/users");
        expect(res.status).toBe(401);
    });
});
