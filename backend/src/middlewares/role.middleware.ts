import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export type Role = "student" | "mentor" | "admin";

export const authorize =
  (allowedRoles: Role[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw { statusCode: 401, message: "Unauthenticated" };
    }

    if (!allowedRoles.includes(user.role as Role)) {
      throw { statusCode: 403, message: "Access forbidden" };
    }

    next();
  };
