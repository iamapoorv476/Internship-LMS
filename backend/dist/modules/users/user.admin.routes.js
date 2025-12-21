"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const user_controller_1 = require("./user.controller");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
/**
 * 🔐 Admin-only middleware
 */
router.use(auth_middleware_1.authenticate);
router.use((0, role_middleware_1.authorize)(["admin"]));
/**
 * 👥 User management
 */
router.get("/", user_controller_1.listUsers);
router.delete("/:id", user_controller_1.removeUser);
/**
 * 🧑‍🏫 Mentor approval flow
 */
router.get("/mentor-requests", admin_controller_1.listMentorRequests);
router.post("/approve-mentor/:id", admin_controller_1.approveMentor);
exports.default = router;
