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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://internship-lms-9ty1.vercel.app",
  // Add all your Vercel preview URLs pattern
  /https:\/\/.*\.vercel\.app$/
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin matches any allowed origin
      const isAllowed = allowedOrigins.some(allowed => {
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return allowed === origin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log('❌ CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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
