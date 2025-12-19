import { supabase } from "../../config/supabase";

export const completeChapter = async (
  studentId: string,
  chapterId: string
) => {
  
  const { data: chapter } = await supabase
    .from("chapters")
    .select("id, course_id, sequence_order")
    .eq("id", chapterId)
    .single();

  if (!chapter) {
    throw { statusCode: 404, message: "Chapter not found" };
  }

  const { data: assignment } = await supabase
    .from("course_assignments")
    .select("id")
    .eq("course_id", chapter.course_id)
    .eq("student_id", studentId)
    .single();

  if (!assignment) {
    throw { statusCode: 403, message: "Course not assigned" };
  }

  const { data: completedChapters } = await supabase
    .from("progress")
    .select("chapter_id")
    .eq("student_id", studentId);

  let expectedSequence = 1;

  if (completedChapters && completedChapters.length > 0) {
    const { data: lastChapter } = await supabase
      .from("chapters")
      .select("sequence_order")
      .in(
        "id",
        completedChapters.map((c) => c.chapter_id)
      )
      .order("sequence_order", { ascending: false })
      .limit(1)
      .single();

    if (lastChapter) {
      expectedSequence = lastChapter.sequence_order + 1;
    }
  }

  if (chapter.sequence_order !== expectedSequence) {
    throw {
      statusCode: 400,
      message: "Chapters must be completed sequentially"
    };
  }

  const { error } = await supabase.from("progress").insert({
    student_id: studentId,
    chapter_id: chapterId
  });

  if (error) {
    throw { statusCode: 400, message: error.message };
  }
};

export const getStudentProgress = async (studentId: string) => {
  const { data, error } = await supabase
    .from("progress")
    .select("chapter_id, completed_at")
    .eq("student_id", studentId);

  if (error) {
    throw { statusCode: 500, message: error.message };
  }

  return data;
};

export const getCourseCompletionPercentage = async (
  studentId: string,
  courseId: string
): Promise<number> => {
  const { count: totalChapters } = await supabase
    .from("chapters")
    .select("*", { count: "exact", head: true })
    .eq("course_id", courseId);

  if (!totalChapters || totalChapters === 0) return 0;

  const { data: completed } = await supabase
    .from("progress")
    .select("chapter_id")
    .eq("student_id", studentId);

  if (!completed) return 0;

  const completedCount = completed.length;

  return Math.round((completedCount / totalChapters) * 100);
};
