import { supabase } from "../../config/supabase";

export const createCourse = async (
  mentorId: string,
  title: string,
  description?: string
) => {
  const { data, error } = await supabase
    .from("courses")
    .insert({
      title,
      description,
      mentor_id: mentorId
    })
    .select()
    .single();

  if (error) {
    throw { statusCode: 400, message: error.message };
  }

  return data;
};

export const getMentorCourses = async (mentorId: string) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("mentor_id", mentorId)
    .order("created_at", { ascending: false });

  if (error) {
    throw { statusCode: 500, message: error.message };
  }

  return data;
};

export const assignCourseToStudents = async (
  mentorId: string,
  courseId: string,
  studentIds: string[]
) => {
  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .eq("mentor_id", mentorId)
    .single();

  if (!course) {
    throw { statusCode: 403, message: "Not your course" };
  }

  const assignments = studentIds.map((studentId) => ({
    course_id: courseId,
    student_id: studentId
  }));

  const { error } = await supabase
    .from("course_assignments")
    .insert(assignments);

  if (error) {
    throw { statusCode: 400, message: error.message };
  }
};
