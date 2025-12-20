import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import {
  createCourseHandler,
  listMentorCourses,
  assignCourse
} from "./course.controller";
import { addChapterHandler } from "../chapters/chapter.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();
router.use(authenticate);
router.post(
  "/",
  authorize(["mentor"]),
  asyncHandler(createCourseHandler)
);

router.get(
  "/my",
  authorize(["mentor"]),
  asyncHandler(listMentorCourses)
);

router.post(
  "/:id/assign",
  authorize(["mentor"]),
  asyncHandler(assignCourse)
);

router.post(
  "/:courseId/chapters",
  authorize(["mentor"]),
  asyncHandler(addChapterHandler)
);

export default router;
