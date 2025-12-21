"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificate = void 0;
const supabase_1 = require("../../config/supabase");
const pdf_1 = require("../../utils/pdf");
const generateCertificate = async (studentId, courseId) => {
    // 1. Ensure course is assigned
    const { data: assignment } = await supabase_1.supabase
        .from("course_assignments")
        .select("id")
        .eq("course_id", courseId)
        .eq("student_id", studentId)
        .single();
    if (!assignment) {
        throw {
            statusCode: 403,
            message: "Course not assigned"
        };
    }
    // 2. Get chapters
    const { data: chapters } = await supabase_1.supabase
        .from("chapters")
        .select("id")
        .eq("course_id", courseId);
    if (!chapters || chapters.length === 0) {
        throw {
            statusCode: 400,
            message: "Course has no chapters"
        };
    }
    const chapterIds = chapters.map((c) => c.id);
    // 3. Check completion
    const { data: completed } = await supabase_1.supabase
        .from("progress")
        .select("chapter_id")
        .eq("student_id", studentId)
        .in("chapter_id", chapterIds);
    if (!completed || completed.length !== chapterIds.length) {
        throw {
            statusCode: 403,
            message: "Course not fully completed"
        };
    }
    // 4. Fetch course & student
    const { data: course } = await supabase_1.supabase
        .from("courses")
        .select("title")
        .eq("id", courseId)
        .single();
    if (!course) {
        throw {
            statusCode: 404,
            message: "Course not found"
        };
    }
    const { data: student } = await supabase_1.supabase
        .from("users")
        .select("email")
        .eq("id", studentId)
        .single();
    if (!student) {
        throw {
            statusCode: 404,
            message: "Student not found"
        };
    }
    // 5. 🔥 CHECK certificate FIRST
    const { data: existingCertificate } = await supabase_1.supabase
        .from("certificates")
        .select("id")
        .eq("course_id", courseId)
        .eq("student_id", studentId)
        .single();
    // 6. Create certificate ONLY if it doesn't exist
    if (!existingCertificate) {
        await supabase_1.supabase
            .from("certificates")
            .insert({
            course_id: courseId,
            student_id: studentId
        })
            .throwOnError();
    }
    // 7. Always generate & return PDF
    return (0, pdf_1.generateCertificatePDF)(student.email, course.title);
};
exports.generateCertificate = generateCertificate;
