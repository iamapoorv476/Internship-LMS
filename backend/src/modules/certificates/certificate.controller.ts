import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { generateCertificate } from "./certificate.service";

export const getCertificate = async (
    req: AuthRequest,
    res:Response
) => {
    const pdfBuffer = await generateCertificate(
        req.user!.userId,
        req.params.courseId
    );
    res.setHeader("Content-Type","application/pdf");
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=certificate.pdf"
    );
    res.send(pdfBuffer);


}