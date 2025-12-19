import jwt from "jsonwebtoken";
import { env } from "./env";

export interface JwtPayload {
  userId: string;
  role: "student" | "mentor" | "admin";
}

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiry
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};
