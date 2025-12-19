import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "./env";

export interface JwtPayload {
  userId: string;
  role: "student" | "mentor" | "admin";
}

const jwtSecret: Secret = env.jwtSecret;

const signOptions: SignOptions = {
  expiresIn: env.jwtExpiry as SignOptions["expiresIn"]
};

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, jwtSecret, signOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, jwtSecret) as JwtPayload;
};
