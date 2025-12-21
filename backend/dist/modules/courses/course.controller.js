"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignCourse = exports.listMentorCourses = exports.createCourseHandler = void 0;
const course_service_1 = require("./course.service");
const createCourseHandler = async (req, res) => {
    const { title, description } = req.body;
    const course = await (0, course_service_1.createCourse)(req.user.id, title, description);
    res.status(201).json(course);
};
exports.createCourseHandler = createCourseHandler;
const listMentorCourses = async (req, res) => {
    const courses = await (0, course_service_1.getMentorCourses)(req.user.id);
    res.status(200).json(courses);
};
exports.listMentorCourses = listMentorCourses;
const assignCourse = async (req, res) => {
    const { id } = req.params;
    const { studentIds } = req.body;
    await (0, course_service_1.assignCourseToStudents)(req.user.id, id, studentIds);
    res.status(200).json({ message: "Course assigned successfully" });
};
exports.assignCourse = assignCourse;
