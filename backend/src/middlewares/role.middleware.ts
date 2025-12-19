import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorize =
  (allowedRoles: Array<"student" | "mentor" | "admin">) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw { statusCode: 401, message: "Unauthenticated" };
    }

    if (!allowedRoles.includes(user.role)) {
      throw { statusCode: 403, message: "Access forbidden" };
    }

    next();
  };
