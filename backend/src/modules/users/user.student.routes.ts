import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  getMyCourses,
  getCourseChapters,
  getAllStudents ,
  requestMentor 
} from "./user.controller";

const router = Router();

router.use(authenticate);
router.get("/students", authorize(["mentor"]), asyncHandler(getAllStudents));
router.post(
  "/request-mentor",
  authenticate,
  authorize(["student"]),
  requestMentor
);


router.get("/my-courses", authorize(["student"]), asyncHandler(getMyCourses));
router.get("/course/:courseId", authorize(["student"]), asyncHandler(getCourseChapters));

export default router;