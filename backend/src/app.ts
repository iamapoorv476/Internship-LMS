import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import courseRoutes from "./modules/courses/course.routes";
import progressRoutes from "./modules/progress/progress.routes";
import certificateRoutes from "./modules/certificates/certificate.routes";

import { authenticate } from "./middlewares/auth.middleware";
import { authorize } from "./middlewares/role.middleware";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", authenticate, authorize(["admin"]), userRoutes);

app.use("/api/courses", authenticate, courseRoutes);

app.use("/api/progress", authenticate, authorize(["student"]), progressRoutes);

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
