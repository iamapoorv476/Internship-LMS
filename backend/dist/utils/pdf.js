"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificatePDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const generateCertificatePDF = (studentEmail, courseTitle) => {
    const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => { });
    doc.fontSize(26).text("Course Completion Certificate", {
        align: "center"
    });
    doc.moveDown(2);
    doc.fontSize(16).text(`This certifies that ${studentEmail}`, { align: "center" });
    doc.moveDown();
    doc.text(`has successfully completed the course`, { align: "center" });
    doc.moveDown(2);
    doc.fontSize(18).text(courseTitle, { align: "center" });
    doc.moveDown(2);
    doc.fontSize(12).text(`Issued on: ${new Date().toDateString()}`, { align: "center" });
    doc.end();
    return Buffer.concat(buffers);
};
exports.generateCertificatePDF = generateCertificatePDF;
