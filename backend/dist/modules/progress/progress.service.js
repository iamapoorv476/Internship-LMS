"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentProgress = exports.completeChapter = void 0;
const supabase_1 = require("../../config/supabase");
const completeChapter = async (studentId, chapterId) => {
    console.log("=== Starting completeChapter ===");
    console.log("Student ID:", studentId);
    console.log("Chapter ID:", chapterId);
    // 1. Fetch chapter
    const { data: chapter, error: chapterError } = await supabase_1.supabase
        .from("chapters")
        .select("id, course_id, sequence_order")
        .eq("id", chapterId)
        .single();
    console.log("Chapter fetched:", chapter);
    console.log("Chapter error:", chapterError);
    if (!chapter) {
        throw { statusCode: 404, message: "Chapter not found" };
    }
    // 2. Verify assignment
    const { data: assignment, error: assignmentError } = await supabase_1.supabase
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
    // 3. Fetch all chapters for this course
    const { data: allChaptersInCourse } = await supabase_1.supabase
        .from("chapters")
        .select("id, sequence_order")
        .eq("course_id", chapter.course_id)
        .order("sequence_order");
    console.log("All chapters in course:", allChaptersInCourse);
    const chapterIdsInCourse = allChaptersInCourse?.map(c => c.id) || [];
    // 4. Fetch completed chapters
    const { data: completedChapters } = await supabase_1.supabase
        .from("progress")
        .select("chapter_id")
        .eq("student_id", studentId)
        .in("chapter_id", chapterIdsInCourse);
    console.log("Completed chapters:", completedChapters);
    let expectedSequence = 1;
    if (completedChapters && completedChapters.length > 0) {
        const completedChapterIds = completedChapters.map(c => c.chapter_id);
        const completedChapterDetails = allChaptersInCourse?.filter(ch => completedChapterIds.includes(ch.id));
        console.log("Completed chapter details:", completedChapterDetails);
        if (completedChapterDetails && completedChapterDetails.length > 0) {
            const maxSequence = Math.max(...completedChapterDetails.map(c => c.sequence_order));
            expectedSequence = maxSequence + 1;
        }
    }
    console.log("Expected sequence:", expectedSequence);
    console.log("Current chapter sequence:", chapter.sequence_order);
    // 5. Enforce sequential completion
    if (chapter.sequence_order !== expectedSequence) {
        throw {
            statusCode: 400,
            message: `Chapters must be completed sequentially. Please complete chapter ${expectedSequence} first.`
        };
    }
    // 6. Insert progress
    const { data: insertedProgress, error: progressError } = await supabase_1.supabase
        .from("progress")
        .upsert({
        student_id: studentId,
        chapter_id: chapterId,
    }, {
        onConflict: "student_id,chapter_id"
    })
        .select();
    console.log("Progress inserted:", insertedProgress);
    console.log("Progress error:", progressError);
    if (progressError) {
        throw { statusCode: 500, message: progressError.message };
    }
    console.log("=== Chapter completion successful ===");
};
exports.completeChapter = completeChapter;
const getStudentProgress = async (studentId) => {
    const { data, error } = await supabase_1.supabase
        .from("progress")
        .select("*")
        .eq("student_id", studentId);
    if (error) {
        throw { statusCode: 500, message: error.message };
    }
    return data;
};
exports.getStudentProgress = getStudentProgress;
