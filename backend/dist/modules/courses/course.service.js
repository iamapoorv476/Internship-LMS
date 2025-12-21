"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignCourseToStudents = exports.getMentorCourses = exports.createCourse = void 0;
const supabase_1 = require("../../config/supabase");
const createCourse = async (mentorId, title, description) => {
    const { data, error } = await supabase_1.supabase
        .from("courses")
        .insert({
        title,
        description,
        mentor_id: mentorId
    })
        .select()
        .single();
    if (error) {
        throw { statusCode: 400, message: error.message };
    }
    return data;
};
exports.createCourse = createCourse;
const getMentorCourses = async (mentorId) => {
    const { data, error } = await supabase_1.supabase
        .from("courses")
        .select("*")
        .eq("mentor_id", mentorId)
        .order("created_at", { ascending: false });
    if (error) {
        throw { statusCode: 500, message: error.message };
    }
    return data;
};
exports.getMentorCourses = getMentorCourses;
const assignCourseToStudents = async (mentorId, courseId, studentIds) => {
    const { data: course } = await supabase_1.supabase
        .from("courses")
        .select("id")
        .eq("id", courseId)
        .eq("mentor_id", mentorId)
        .single();
    if (!course) {
        throw { statusCode: 403, message: "Not your course" };
    }
    const assignments = studentIds.map((studentId) => ({
        course_id: courseId,
        student_id: studentId
    }));
    const { error } = await supabase_1.supabase
        .from("course_assignments")
        .insert(assignments);
    if (error) {
        throw { statusCode: 400, message: error.message };
    }
};
exports.assignCourseToStudents = assignCourseToStudents;
