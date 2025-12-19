import { Router } from "express";
import {
  listUsers,
  approveMentorAccount,
  removeUser
} from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

router.use(authenticate);
router.use(authorize(["admin"]));

router.get("/", listUsers);
router.put("/:id/approve-mentor", approveMentorAccount);
router.delete("/:id", removeUser);

export default router;
