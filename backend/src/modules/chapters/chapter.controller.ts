import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { addChapter } from "./chapter.service";

export const addChapterHandler = async (
  req: AuthRequest,
  res: Response
) => {
  const { id } = req.params;
  const { title, description, imageUrl, videoUrl } = req.body;

  const chapter = await addChapter(
    req.user!.userId,
    id,
    title,
    description,
    imageUrl,
    videoUrl
  );

  res.status(201).json(chapter);
};
