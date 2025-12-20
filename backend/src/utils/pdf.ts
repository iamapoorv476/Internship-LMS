import PDFDocument from "pdfkit";

export const generateCertificatePDF =(
    studentEmail:string,
    courseTitle:string
): Buffer =>{
    const doc = new PDFDocument({size : "A4", margin: 50});
    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end",()=> {});

    doc.fontSize(26).text("Course Completion Certificate",{
        align: "center"
    })

    doc.moveDown(2);
    doc.fontSize(16).text(
        `This certifies that ${studentEmail}`,
    { align: "center" }
    );
    doc.moveDown();
    doc.text(
         `has successfully completed the course`,
    { align: "center" }
    );

    doc.moveDown(2);
    doc.fontSize(18).text(courseTitle,{align:"center"});
     doc.moveDown(2);
  doc.fontSize(12).text(
    `Issued on: ${new Date().toDateString()}`,
    { align: "center" }
  );

  doc.end();

  return Buffer.concat(buffers);


}