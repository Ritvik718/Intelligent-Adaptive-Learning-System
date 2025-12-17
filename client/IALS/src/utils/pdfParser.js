import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

// Required for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Parse PDF file and return plain text
 */
export async function parsePDF(file) {
  if (!file) return "";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const pageText = content.items.map((item) => item.str).join(" ");

    fullText += `\n\n${pageText}`;
  }

  return fullText.trim();
}
