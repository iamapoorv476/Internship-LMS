"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const supabase_1 = require("../../config/supabase");
const jwt_1 = require("../../config/jwt");
const uniqueEmail = (prefix) => `${prefix}-${Date.now()}@test.com`;
describe("Certificate Generation", () => {
    let token;
    let courseId;
    let studentId;
    beforeAll(async () => {
        const { data: student } = await supabase_1.supabase
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
        token = (0, jwt_1.signToken)({ userId: studentId, role: "student" });
        const { data: course } = await supabase_1.supabase
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
        const res = await (0, supertest_1.default)(app_1.default)
            .get(`/api/certificates/${courseId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Course not assigned");
    });
});
