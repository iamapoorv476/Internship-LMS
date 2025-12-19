import { supabase } from "../../config/supabase";
import { generateCertificatePDF } from "../../utils/pdf";

export const generateCertificate = async (
  studentId: string,
  courseId: string
) => {
  const { data: assignment } = await supabase
    .from("course_assignments")
    .select("id")
    .eq("course_id", courseId)
    .eq("student_id", studentId)
    .single();

  if (!assignment) {
    throw { statusCode: 403, message: "Course not assigned" };
  }

  const { count: totalChapters } = await supabase
    .from("chapters")
    .select("*", { count: "exact", head: true })
    .eq("course_id", courseId);

  const { count: completed } = await supabase
    .from("progress")
    .select("id", { count: "exact", head: true })
    .eq("student_id", studentId)
    .in(
      "chapter_id",
      supabase
        .from("chapters")
        .select("id")
        .eq("course_id", courseId)
    );

  if (completed !== totalChapters) {
    throw {
      statusCode: 403,
      message: "Course not fully completed"
    };
  }

  const [{ data: course }, { data: student }] = await Promise.all([
    supabase
      .from("courses")
      .select("title")
      .eq("id", courseId)
      .single(),
    supabase
      .from("users")
      .select("email")
      .eq("id", studentId)
      .single()
  ]);

  await supabase
    .from("certificates")
    .insert({
      course_id: courseId,
      student_id: studentId
    })
    .throwOnError();

  return generateCertificatePDF(student.email, course.title);
};
