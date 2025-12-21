import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";

import adminUserRoutes from "./modules/users/user.admin.routes";
import studentUserRoutes from "./modules/users/user.student.routes";
import courseRoutes from "./modules/courses/course.routes";
import progressRoutes from "./modules/progress/progress.routes";
import certificateRoutes from "./modules/certificates/certificate.routes";

import { authenticate } from "./middlewares/auth.middleware";
import { authorize } from "./middlewares/role.middleware";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://internship-lms-klht.vercel.app"
    ],
    credentials: true
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/auth", authRoutes);

app.use("/api/admin/users", adminUserRoutes);
app.use("/api/users", studentUserRoutes);


app.use("/api/courses", authenticate, courseRoutes);

app.use("/api/progress", authenticate, progressRoutes);

app.use(
  "/api/certificates",
  authenticate,
  authorize(["student"]),
  certificateRoutes
);

if (process.env.NODE_ENV === "test") {
  app.get(
    "/api/protected",
    authenticate,
    authorize(["admin"]),
    (_req, res) => {
      res.status(200).json({ ok: true });
    }
  );
}

app.use(errorHandler);

export default app;
