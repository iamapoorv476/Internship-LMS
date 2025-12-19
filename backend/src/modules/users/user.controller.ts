import { Request, Response } from "express";
import {
  getAllUsers,
  approveMentor,
  deleteUser
} from "./user.service";

export const listUsers = async (_req: Request, res: Response) => {
  const users = await getAllUsers();
  res.status(200).json(users);
};

export const approveMentorAccount = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  await approveMentor(id);

  res.status(200).json({ message: "Mentor approved successfully" });
};

export const removeUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  await deleteUser(id);

  res.status(204).send();
};
