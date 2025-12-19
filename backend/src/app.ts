import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use(errorHandler);

export default app;
