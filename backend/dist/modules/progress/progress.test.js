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
describe("Student Progress", () => {
    let studentId;
    let token;
    let courseId;
    let chapter1;
    let chapter2;
    beforeAll(async () => {
        const { data: student, error: studentError } = await supabase_1.supabase
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
        token = (0, jwt_1.signToken)({ userId: studentId, role: "student" });
        const { data: course, error: courseError } = await supabase_1.supabase
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
        const { data: ch1 } = await supabase_1.supabase
            .from("chapters")
            .insert({
            course_id: courseId,
            title: "Chapter 1",
            description: "",
            sequence_order: 1
        })
            .select()
            .single();
        const { data: ch2 } = await supabase_1.supabase
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
        await supabase_1.supabase.from("course_assignments").insert({
            course_id: courseId,
            student_id: studentId
        });
    });
    afterAll(async () => {
        await supabase_1.supabase.from("progress").delete().eq("student_id", studentId);
        await supabase_1.supabase.from("course_assignments").delete().eq("student_id", studentId);
        await supabase_1.supabase.from("chapters").delete().eq("course_id", courseId);
        await supabase_1.supabase.from("courses").delete().eq("id", courseId);
        await supabase_1.supabase.from("users").delete().eq("id", studentId);
    });
    it("prevents skipping chapters", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post(`/api/progress/${chapter2}/complete`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Chapters must be completed sequentially");
    });
    it("allows sequential completion", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post(`/api/progress/${chapter1}/complete`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message.toLowerCase()).toContain("completed");
    });
});
