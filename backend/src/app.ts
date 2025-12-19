import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});


app.use(errorHandler);

export default app;
