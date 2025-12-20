import { supabase } from "../../config/supabase";
import { generateCertificatePDF } from "../../utils/pdf";

export const generateCertificate = async (
  studentId: string,
  courseId: string
): Promise<Buffer> => {
  const { data: assignment, error: assignmentError } = await supabase
    .from("course_assignments")
    .select("id")
    .eq("course_id", courseId)
    .eq("student_id", studentId)
    .single();

  if (assignmentError || !assignment) {
    throw {
      statusCode: 403,
      message: "Course not assigned"
    };
  }

  const { data: chapters, error: chaptersError } = await supabase
    .from("chapters")
    .select("id")
    .eq("course_id", courseId);

  if (chaptersError || !chapters || chapters.length === 0) {
    throw {
      statusCode: 400,
      message: "Course has no chapters"
    };
  }

  const chapterIds = chapters.map((c) => c.id);

  const { data: completed, error: progressError } = await supabase
    .from("progress")
    .select("chapter_id")
    .eq("student_id", studentId)
    .in("chapter_id", chapterIds);

  if (
    progressError ||
    !completed ||
    completed.length !== chapterIds.length
  ) {
    throw {
      statusCode: 403,
      message: "Course not fully completed"
    };
  }

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("title")
    .eq("id", courseId)
    .single();

  if (courseError || !course) {
    throw {
      statusCode: 404,
      message: "Course not found"
    };
  }

  const { data: student, error: studentError } = await supabase
    .from("users")
    .select("email")
    .eq("id", studentId)
    .single();

  if (studentError || !student) {
    throw {
      statusCode: 404,
      message: "Student not found"
    };
  }

  await supabase
    .from("certificates")
    .insert({
      course_id: courseId,
      student_id: studentId
    })
    .throwOnError();

  return generateCertificatePDF(student.email, course.title);
};
