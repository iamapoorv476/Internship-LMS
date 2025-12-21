import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

import {
  listUsers,
  removeUser
} from "./user.controller";

import {
  listMentorRequests,
  approveMentor
} from "./admin.controller";

const router = Router();

router.use(authenticate);
router.use(authorize(["admin"]));
router.get("/", listUsers);
router.delete("/:id", removeUser);
router.get("/mentor-requests", listMentorRequests);
router.post("/approve-mentor/:id", approveMentor);

export default router;
