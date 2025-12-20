import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  createCourse,
  getMentorCourses,
  assignCourseToStudents
} from "./course.service";

export const createCourseHandler = async (
  req: AuthRequest,
  res: Response
) => {
  const { title, description } = req.body;

  const course = await createCourse(
    req.user!.id,    
    title,
    description
  );

  res.status(201).json(course);
};

export const listMentorCourses = async (
  req: AuthRequest,
  res: Response
) => {
  const courses = await getMentorCourses(req.user!.id);
  res.status(200).json(courses);
};

export const assignCourse = async (
  req: AuthRequest,
  res: Response
) => {
  const { id } = req.params;
  const { studentIds } = req.body;

  await assignCourseToStudents(req.user!.id,     id, studentIds);

  res.status(200).json({ message: "Course assigned successfully" });
};
