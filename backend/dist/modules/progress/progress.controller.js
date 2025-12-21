"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProgress = exports.completeChapterHandler = void 0;
const progress_service_1 = require("./progress.service");
const completeChapterHandler = async (req, res, next) => {
    try {
        await (0, progress_service_1.completeChapter)(req.user.id, req.params.chapterId);
        return res.status(200).json({ message: "Chapter completed" });
    }
    catch (err) {
        return next(err);
    }
};
exports.completeChapterHandler = completeChapterHandler;
const getMyProgress = async (req, res, next) => {
    try {
        const progress = await (0, progress_service_1.getStudentProgress)(req.user.id);
        return res.status(200).json(progress);
    }
    catch (err) {
        return next(err);
    }
};
exports.getMyProgress = getMyProgress;
