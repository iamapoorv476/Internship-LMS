import {Response} from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import{
    completeChapter,
    getStudentProgress
} from "./progress.service";

export const completeChapterHandler = async(
    req: AuthRequest,
    res: Response
)=>{
    await completeChapter(req.user!.userId, req.params.chapterId);
    res.status(200).json({message:"Chapter completed"});

};

export const getMyProgress = async(
    req:AuthRequest,
    res:Response
) =>{
    const progress = await getStudentProgress(req.user!.userId);
    res.status(200).json(progress);

};