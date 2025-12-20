import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  getAllUsers,
  approveMentor,
  deleteUser
} from "./user.service";
import { supabase } from "../../config/supabase";

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

export const getMyCourses = async (
  req: AuthRequest,
  res: Response
) => {
  const studentId = req.user!.id;

  const { data, error } = await supabase
    .from("course_assignments")
    .select(`
      course:courses (
        id,
        title
      )
    `)
    .eq("student_id", studentId);

  if (error) {
    throw { statusCode: 500, message: error.message };
  }
  const courses = data.map((row) => row.course);

  res.status(200).json(courses);
};

export const getCourseChapters = async (
  req: AuthRequest,
  res: Response
) => {
  const studentId = req.user!.id;
  const { courseId } = req.params;
  const { data: assigned } = await supabase
    .from("course_assignments")
    .select("id")
    .eq("student_id", studentId)
    .eq("course_id", courseId)
    .single();

  if (!assigned) {
    throw { statusCode: 403, message: "Not enrolled in this course" };
  }

  const { data, error } = await supabase
    .from("chapters")
    .select("id, title")
    .eq("course_id", courseId)
    .order("sequence_order");

  if (error) {
    throw { statusCode: 500, message: error.message };
  }

  res.status(200).json(
    data.map((c) => ({
      ...c,
      completed: false
    }))
  );
};
