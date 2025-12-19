import { supabase } from "../../config/supabase";

export const addChapter = async (
  mentorId: string,
  courseId: string,
  title: string,
  description: string,
  imageUrl?: string,
  videoUrl?: string
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

  // Determine next sequence number
  const { data: lastChapter } = await supabase
    .from("chapters")
    .select("sequence_order")
    .eq("course_id", courseId)
    .order("sequence_order", { ascending: false })
    .limit(1)
    .single();

  const nextSequence = lastChapter
    ? lastChapter.sequence_order + 1
    : 1;

  const { data, error } = await supabase
    .from("chapters")
    .insert({
      course_id: courseId,
      title,
      description,
      image_url: imageUrl,
      video_url: videoUrl,
      sequence_order: nextSequence
    })
    .select()
    .single();

  if (error) {
    throw { statusCode: 400, message: error.message };
  }

  return data;
};
