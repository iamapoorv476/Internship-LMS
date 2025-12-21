"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStudents = exports.getCourseChapters = exports.getMyCourses = exports.requestMentor = exports.removeUser = exports.approveMentorAccount = exports.listUsers = void 0;
const user_service_1 = require("./user.service");
const supabase_1 = require("../../config/supabase");
/* ============================
   ADMIN CONTROLLERS
============================ */
/** Admin: list all users */
const listUsers = async (_req, res) => {
    const users = await (0, user_service_1.getAllUsers)();
    res.status(200).json(users);
};
exports.listUsers = listUsers;
/** Admin: approve mentor */
const approveMentorAccount = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase_1.supabase
        .from("users")
        .update({
        role: "mentor",
        mentor_requested: false
    })
        .eq("id", id);
    if (error) {
        throw { statusCode: 500, message: error.message };
    }
    res.status(200).json({ message: "Mentor approved successfully" });
};
exports.approveMentorAccount = approveMentorAccount;
/** Admin: delete user */
const removeUser = async (req, res) => {
    const { id } = req.params;
    await (0, user_service_1.deleteUser)(id);
    res.status(204).send();
};
exports.removeUser = removeUser;
/* ============================
   STUDENT CONTROLLERS
============================ */
/** Student: request mentor access */
/** Student: request mentor access - AUTO APPROVE */
const requestMentor = async (req, res) => {
    const userId = req.user.id;
    // Directly change role to mentor (no approval needed)
    const { error } = await supabase_1.supabase
        .from("users")
        .update({
        role: "mentor",
        mentor_requested: false // Mark as not pending since it's auto-approved
    })
        .eq("id", userId);
    if (error) {
        throw { statusCode: 500, message: error.message };
    }
    res.json({ message: "You are now a mentor!" });
};
exports.requestMentor = requestMentor;
/** Student: get assigned courses */
const getMyCourses = async (req, res) => {
    const studentId = req.user.id;
    const { data, error } = await supabase_1.supabase
        .from("course_assignments")
        .select(`
      course:courses (
        id,
        title
      )
    `)
        .eq("student_id", studentId);
    if (error) {
        throw { statusCode: 500, message: error.message };
    }
    const courses = data?.map((row) => row.course) || [];
    res.status(200).json(courses);
};
exports.getMyCourses = getMyCourses;
/** Student: get chapters + progress */
const getCourseChapters = async (req, res) => {
    const studentId = req.user.id;
    const { courseId } = req.params;
    // Verify enrollment
    const { data: assigned } = await supabase_1.supabase
        .from("course_assignments")
        .select("id")
        .eq("student_id", studentId)
        .eq("course_id", courseId)
        .single();
    if (!assigned) {
        throw { statusCode: 403, message: "Not enrolled in this course" };
    }
    // Fetch chapters
    const { data: chapters, error: chaptersError } = await supabase_1.supabase
        .from("chapters")
        .select("id, title")
        .eq("course_id", courseId)
        .order("sequence_order");
    if (chaptersError) {
        throw { statusCode: 500, message: chaptersError.message };
    }
    if (!chapters || chapters.length === 0) {
        return res.json([]);
    }
    // Fetch progress
    const { data: progress } = await supabase_1.supabase
        .from("progress")
        .select("chapter_id")
        .eq("student_id", studentId)
        .in("chapter_id", chapters.map((c) => c.id));
    const completedIds = new Set(progress?.map((p) => p.chapter_id) || []);
    const result = chapters.map((chapter) => ({
        ...chapter,
        completed: completedIds.has(chapter.id)
    }));
    res.status(200).json(result);
};
exports.getCourseChapters = getCourseChapters;
/* ============================
   MENTOR HELPERS
============================ */
/** Mentor: list students */
const getAllStudents = async (_req, res) => {
    const { data, error } = await supabase_1.supabase
        .from("users")
        .select("id, email")
        .eq("role", "student")
        .order("email");
    if (error) {
        throw { statusCode: 500, message: error.message };
    }
    res.status(200).json(data);
};
exports.getAllStudents = getAllStudents;
