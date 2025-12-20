import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { generateCertificate } from "./certificate.service";

export const getCertificate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const pdfBuffer = await generateCertificate(
      req.user!.id,
      req.params.courseId
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificate.pdf"
    );

    return res.send(pdfBuffer);
  } catch (err) {
    return next(err);
  }
};
