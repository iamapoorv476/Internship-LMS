import { supabase } from "../../config/supabase";

export const completeChapter = async (
    studentId: string,
    chapterId: string
) =>{
    const {data: chapter} = await supabase
         .from("chapters")
         .select("id, course_id,sequence_order")
         .eq("id",chapterId)
         .single();
    if(!chapter){
        throw {statusCode:404,message:"Chapter not found"};
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
      const {data: lastProgress} = await supabase
            .from("progress")
            .select("chapters(sequence_order)")
            .eq("student_id", studentId)
            .eq("chapters.course_id",chapter.course_id)
            .order("completed_at",{ascending: false})
            .limit(1)
            .single();

        const expectedSequence = lastProgress? lastProgress.chapters.sequence_order + 1
                                        : 
        
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
    .select(`
      chapter_id,
      completed_at,
      chapters (
        course_id,
        sequence_order
      )
    `)
    .eq("student_id", studentId);

  if (error) {
    throw { statusCode: 500, message: error.message };
  }

  return data;
};

export const getCourseCompletionPercentage = async (
  studentId: string,
  courseId: string
) => {
  const [{ count: totalChapters }, { count: completed }] =
    await Promise.all([
      supabase
        .from("chapters")
        .select("*", { count: "exact", head: true })
        .eq("course_id", courseId),
      supabase
        .from("progress")
        .select("id", { count: "exact", head: true })
        .eq("student_id", studentId)
        .in(
          "chapter_id",
          supabase
            .from("chapters")
            .select("id")
            .eq("course_id", courseId)
        )
    ]);

  if (!totalChapters) return 0;

  return Math.round((completed / totalChapters) * 100);
};

                                
