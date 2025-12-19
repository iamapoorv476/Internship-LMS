import express from "express";
import cors from "cors";
import progressRoutes from "./modules/progress/progress.routes";

import courseRoutes from "./modules/courses/course.routes";
import userRoutes from "./modules/users/user.routes";
import { addChapterHandler } from "./modules/chapters/chapter.controller";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/users", userRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

app.post(
  "/api/courses/:id/chapters",
  authenticate,
  authorize(["mentor"]),
  addChapterHandler
);
app.use(errorHandler);

export default app;
