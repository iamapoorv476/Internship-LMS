"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addChapterHandler = void 0;
const chapter_service_1 = require("./chapter.service");
const addChapterHandler = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const { title, description, imageUrl, videoUrl } = req.body;
        const chapter = await (0, chapter_service_1.addChapter)(req.user.id, courseId, title, description, imageUrl, videoUrl);
        res.status(201).json(chapter);
    }
    catch (err) {
        next(err);
    }
};
exports.addChapterHandler = addChapterHandler;
