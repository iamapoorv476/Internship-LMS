"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// Route for mentors to get all students - MUST come before student-only routes
router.get("/students", (0, role_middleware_1.authorize)(["mentor"]), (0, asyncHandler_1.asyncHandler)(user_controller_1.getAllStudents));
router.post("/request-mentor", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["student"]), user_controller_1.requestMentor);
// Student-only routes
router.get("/my-courses", (0, role_middleware_1.authorize)(["student"]), (0, asyncHandler_1.asyncHandler)(user_controller_1.getMyCourses));
router.get("/course/:courseId", (0, role_middleware_1.authorize)(["student"]), (0, asyncHandler_1.asyncHandler)(user_controller_1.getCourseChapters));
exports.default = router;
