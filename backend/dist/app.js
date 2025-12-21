"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const user_admin_routes_1 = __importDefault(require("./modules/users/user.admin.routes"));
const user_student_routes_1 = __importDefault(require("./modules/users/user.student.routes"));
const course_routes_1 = __importDefault(require("./modules/courses/course.routes"));
const progress_routes_1 = __importDefault(require("./modules/progress/progress.routes"));
const certificate_routes_1 = __importDefault(require("./modules/certificates/certificate.routes"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const role_middleware_1 = require("./middlewares/role.middleware");
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "OK" });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/admin/users", user_admin_routes_1.default);
app.use("/api/users", user_student_routes_1.default);
app.use("/api/courses", auth_middleware_1.authenticate, course_routes_1.default);
app.use("/api/progress", auth_middleware_1.authenticate, progress_routes_1.default);
app.use("/api/certificates", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["student"]), certificate_routes_1.default);
if (process.env.NODE_ENV === "test") {
    app.get("/api/protected", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin"]), (_req, res) => {
        res.status(200).json({ ok: true });
    });
}
app.use(error_middleware_1.errorHandler);
exports.default = app;
