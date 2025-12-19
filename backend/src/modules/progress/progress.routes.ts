import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import {
  completeChapterHandler,
  getMyProgress
} from "./progress.controller";

const router = Router();

router.use(authenticate);
router.use(authorize(["student"]));

router.post("/:chapterId/complete", completeChapterHandler);
router.get("/my", getMyProgress);

export default router;
