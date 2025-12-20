import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  completeChapter,
  getStudentProgress
} from "./progress.service";

export const completeChapterHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await completeChapter(req.user!.id, req.params.chapterId);

    return res.status(200).json({ message: "Chapter completed" });
  } catch (err) {
    return next(err);
  }
};

export const getMyProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const progress = await getStudentProgress(req.user!.id);

    return res.status(200).json(progress);
  } catch (err) {
    return next(err);
  }
};
