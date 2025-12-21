import { supabase } from "../../config/supabase";

export const completeChapter = async (
  studentId: string,
  chapterId: string
) => {
  console.log("=== Starting completeChapter ===");
  console.log("Student ID:", studentId);
  console.log("Chapter ID:", chapterId);

 
  const { data: chapter, error: chapterError } = await supabase
    .from("chapters")
    .select("id, course_id, sequence_order")
    .eq("id", chapterId)
    .single();

  console.log("Chapter fetched:", chapter);
  console.log("Chapter error:", chapterError);

  if (!chapter) {
    throw { statusCode: 404, message: "Chapter not found" };
  }

  
  const { data: assignment, error: assignmentError } = await supabase
    .from("course_assignments")
    .select("id")
    .eq("course_id", chapter.course_id)
    .eq("student_id", studentId)
    .single();

  console.log("Assignment found:", assignment);
  console.log("Assignment error:", assignmentError);

  if (!assignment) {
    throw { statusCode: 403, message: "Course not assigned" };
  }

  
  const { data: allChaptersInCourse } = await supabase
    .from("chapters")
    .select("id, sequence_order")
    .eq("course_id", chapter.course_id)
    .order("sequence_order");

  console.log("All chapters in course:", allChaptersInCourse);

  const chapterIdsInCourse = allChaptersInCourse?.map(c => c.id) || [];

  
  const { data: completedChapters } = await supabase
    .from("progress")
    .select("chapter_id")
    .eq("student_id", studentId)
    .in("chapter_id", chapterIdsInCourse);

  console.log("Completed chapters:", completedChapters);

  let expectedSequence = 1;

  if (completedChapters && completedChapters.length > 0) {
    const completedChapterIds = completedChapters.map(c => c.chapter_id);
    const completedChapterDetails = allChaptersInCourse?.filter(ch => 
      completedChapterIds.includes(ch.id)
    );
    
    console.log("Completed chapter details:", completedChapterDetails);
    
    if (completedChapterDetails && completedChapterDetails.length > 0) {
      const maxSequence = Math.max(...completedChapterDetails.map(c => c.sequence_order));
      expectedSequence = maxSequence + 1;
    }
  }

  console.log("Expected sequence:", expectedSequence);
  console.log("Current chapter sequence:", chapter.sequence_order);

  
  if (chapter.sequence_order !== expectedSequence) {
    throw {
      statusCode: 400,
      message: `Chapters must be completed sequentially. Please complete chapter ${expectedSequence} first.`
    };
  }

 
  const { data: insertedProgress, error: progressError } = await supabase
    .from("progress")
    .upsert(
      {
        student_id: studentId,
        chapter_id: chapterId,
      },
      {
        onConflict: "student_id,chapter_id"
      }
    )
    .select();

  console.log("Progress inserted:", insertedProgress);
  console.log("Progress error:", progressError);

  if (progressError) {
    throw { statusCode: 500, message: progressError.message };
  }

  console.log("=== Chapter completion successful ===");
};

export const getStudentProgress = async (studentId: string) => {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("student_id", studentId);

  if (error) {
    throw { statusCode: 500, message: error.message };
  }

  return data;
};