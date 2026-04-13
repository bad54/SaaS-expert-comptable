import { NextRequest, NextResponse } from "next/server";
import { extractInvoiceData, suggestAccountingEntry } from "@/lib/ocr/extract";

// POST /api/ocr - Process a document with OCR
// Accepts: { imageUrl: string, docType: string } or FormData with file
export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  let text = "";
  let docType = "AUTRE";

  if (contentType.includes("application/json")) {
    // JSON mode: receive raw text (for when OCR is done client-side)
    const body = await request.json();
    text = body.text ?? "";
    docType = body.docType ?? "AUTRE";
  } else {
    // For future: handle file upload directly
    return NextResponse.json(
      { error: "Envoyez le texte OCR en JSON: { text, docType }" },
      { status: 400 }
    );
  }

  if (!text.trim()) {
    return NextResponse.json(
      { error: "Aucun texte a analyser" },
      { status: 400 }
    );
  }

  const extractedData = extractInvoiceData(text);
  const suggestedEntry = suggestAccountingEntry(extractedData, docType);

  return NextResponse.json({
    extractedData,
    suggestedEntry,
    rawText: text.substring(0, 2000),
  });
}
