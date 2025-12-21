"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addChapter = void 0;
const supabase_1 = require("../../config/supabase");
const addChapter = async (mentorId, courseId, title, description, imageUrl, videoUrl) => {
    const { data: course } = await supabase_1.supabase
        .from("courses")
        .select("id")
        .eq("id", courseId)
        .eq("mentor_id", mentorId)
        .single();
    if (!course) {
        throw { statusCode: 403, message: "Not your course" };
    }
    const { data: lastChapter } = await supabase_1.supabase
        .from("chapters")
        .select("sequence_order")
        .eq("course_id", courseId)
        .order("sequence_order", { ascending: false })
        .limit(1)
        .single();
    const nextSequence = lastChapter
        ? lastChapter.sequence_order + 1
        : 1;
    const { data, error } = await supabase_1.supabase
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
exports.addChapter = addChapter;
