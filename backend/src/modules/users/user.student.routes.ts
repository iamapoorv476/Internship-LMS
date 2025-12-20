import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  getMyCourses,
  getCourseChapters
} from "./user.controller";

const router = Router();

router.use(authenticate);
router.use(authorize(["student"]));

router.get("/my-courses", asyncHandler(getMyCourses));
router.get("/course/:courseId", asyncHandler(getCourseChapters));

export default router;
