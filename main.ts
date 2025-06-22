import express, { Request, Response } from "express";

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const app = express();
const PORT = 5002;

app.get("/", (_req: Request, res: Response) => {
  console.log("WebService 2 accessed");
  res.send("Hello from WebService 2");
});

app.get("/download-table", async (req, res) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  const tableData = [
    ["Name", "Age", "City"],
    ["Alice", "24", "New York"],
    ["Bob", "30", "San Francisco"],
    ["Charlie", "29", "Los Angeles"],
  ];

  const startX = 50;
  let startY = 350;
  const cellWidth = 150;
  const cellHeight = 30;

  // Draw table
  for (let rowIndex = 0; rowIndex < tableData.length; rowIndex++) {
    const row = tableData[rowIndex];
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const x = startX + colIndex * cellWidth;
      const y = startY - rowIndex * cellHeight;

      // Draw cell border
      page.drawRectangle({
        x,
        y,
        width: cellWidth,
        height: cellHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      // Draw text
      page.drawText(row[colIndex], {
        x: x + 5,
        y: y + 10,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }
  }

  const pdfBytes = await pdfDoc.save();

  res.setHeader("Content-Disposition", 'attachment; filename="table.pdf"');
  res.setHeader("Content-Type", "application/pdf");
  res.send(Buffer.from(pdfBytes));
});

app.listen(PORT, () => {
  console.log(`WebService 1 running on http://localhost:${PORT}`);
});
