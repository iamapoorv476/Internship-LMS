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

  const { error } = await supabase
    .from("users")
    .update({
      role: "mentor",
      mentor_requested: false
    })
    .eq("id", id);

  if (error) {
    throw { statusCode: 500, message: error.message };
  }

  res.status(200).json({ message: "Mentor approved successfully" });
};

export const removeUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteUser(id);
  res.status(204).send();
};

export const requestMentor = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user!.id;
  const { error } = await supabase
    .from("users")
    .update({ 
      role: "mentor",
      mentor_requested: false 
    })
    .eq("id", userId);

  if (error) {
    throw { statusCode: 500, message: error.message };
  }

  res.json({ message: "You are now a mentor!" });
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

  const courses = data?.map((row) => row.course) || [];
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
  const { data: chapters, error: chaptersError } = await supabase
    .from("chapters")
    .select("id, title")
    .eq("course_id", courseId)
    .order("sequence_order");

  if (chaptersError) {
    throw { statusCode: 500, message: chaptersError.message };
  }

  if (!chapters || chapters.length === 0) {
    return res.json([]);
  }
  const { data: progress } = await supabase
    .from("progress")
    .select("chapter_id")
    .eq("student_id", studentId)
    .in(
      "chapter_id",
      chapters.map((c) => c.id)
    );

  const completedIds = new Set(
    progress?.map((p) => p.chapter_id) || []
  );

  const result = chapters.map((chapter) => ({
    ...chapter,
    completed: completedIds.has(chapter.id)
  }));

  res.status(200).json(result);
};

export const getAllStudents = async (
  _req: AuthRequest,
  res: Response
) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, email")
    .eq("role", "student")
    .order("email");

  if (error) {
    throw { statusCode: 500, message: error.message };
  }

  res.status(200).json(data);
};
