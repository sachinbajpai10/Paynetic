/**
 * Generates a sample invoice PDF for Paynetic upload/testing.
 * Run: node scripts/generate-sample-invoice.mjs
 * Output: public/sample-invoice.pdf
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generate() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();

  const margin = 50;
  let y = height - margin;

  const drawText = (text, x, size = 11, bold = false) => {
    const f = bold ? fontBold : font;
    page.drawText(text, { x, y, size, font: f, color: rgb(0.1, 0.1, 0.2) });
    y -= size + 4;
  };

  // Header
  page.drawText("INVOICE", { x: margin, y, size: 24, font: fontBold, color: rgb(0.1, 0.2, 0.35) });
  y -= 32;

  // From / Bill From
  drawText("From:", margin, 12, true);
  drawText("Aligned Assets", margin, 11);
  drawText("United Kingdom", margin, 11);
  drawText("Tax Form: W-8BEN", margin, 10);
  y -= 12;

  // Invoice details box
  drawText("Invoice Number: INV-2025-847", margin, 11, true);
  drawText("Date: November 28, 2025", margin, 11);
  drawText("Due Date: December 28, 2025", margin, 11);
  y -= 20;

  // Line items header
  drawText("Description", margin, 10, true);
  const amtX = width - margin - 80;
  page.drawText("Amount", { x: amtX, y: y + 14, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.2) });
  y -= 6;

  // Simple line
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  y -= 16;

  // Line item
  page.drawText("Contractor services – November 2025", { x: margin, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
  page.drawText("$2,500.00", { x: amtX, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
  y -= 24;

  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  y -= 20;

  // Total
  page.drawText("Total", { x: margin, y, size: 12, font: fontBold, color: rgb(0.1, 0.1, 0.2) });
  page.drawText("$2,500.00", { x: amtX, y, size: 12, font: fontBold, color: rgb(0.1, 0.1, 0.2) });
  y -= 40;

  // Footer note
  drawText("Payment terms: Net 30. Thank you for your business.", margin, 9);
  drawText("Aligned Assets | United Kingdom | W-8BEN on file", margin, 8);

  const bytes = await doc.save();
  const outPath = path.join(__dirname, "..", "public", "sample-invoice.pdf");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, bytes);
  console.log("Created:", outPath);
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
