import { Request, Response, NextFunction } from "express";
import { registerStudent, loginUser } from "./auth.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    await registerStudent(email, password);

    res.status(201).json({
      message: "Student registered successfully",
    });
  } catch (err) {
    next(err);
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

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  res.status(200).json({
    id: req.user!.id,
    email: req.user!.email,
    role: req.user!.role,
    mentor_requested: req.user!.mentor_requested,
  });
};
