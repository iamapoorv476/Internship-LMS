"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCertificate = void 0;
const certificate_service_1 = require("./certificate.service");
const getCertificate = async (req, res, next) => {
    try {
        const pdfBuffer = await (0, certificate_service_1.generateCertificate)(req.user.id, req.params.courseId);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=certificate.pdf");
        return res.send(pdfBuffer);
    }
    catch (err) {
        return next(err);
    }
};
exports.getCertificate = getCertificate;
