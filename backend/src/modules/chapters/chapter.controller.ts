import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { addChapter } from "./chapter.service";

export const addChapterHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const { title, description, imageUrl, videoUrl } = req.body;

    const chapter = await addChapter(
      req.user!.id,       
      courseId,           
      title,
      description,
      imageUrl,
      videoUrl
    );

    res.status(201).json(chapter);
  } catch (err) {
    next(err);
  }
};
