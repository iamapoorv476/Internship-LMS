import { Request, Response } from "express";
import { registerStudent, loginUser } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  await registerStudent(email, password);

  res.status(201).json({ message: "Student registered successfully" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const token = await loginUser(email, password);

  res.status(200).json({ token });
};
