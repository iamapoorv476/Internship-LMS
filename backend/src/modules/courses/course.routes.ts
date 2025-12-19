import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import {
  createCourseHandler,
  listMentorCourses,
  assignCourse
} from "./course.controller";

const router = Router();

router.use(authenticate);
router.use(authorize(["mentor"]));

router.post("/", createCourseHandler);
router.get("/my", listMentorCourses);
router.post("/:id/assign", assignCourse);

export default router;
