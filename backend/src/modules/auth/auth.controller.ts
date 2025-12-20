import { Request, Response, NextFunction } from "express";
import { registerStudent, loginUser } from "./auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    await registerStudent(email, password);

    return res
      .status(201)
      .json({ message: "Student registered successfully" });
  } catch (err) {
    return next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const token = await loginUser(email, password);

    return res.status(200).json({ token });
  } catch (err) {
    return next(err);
  }
};

