import { NextRequest, NextResponse } from "next/server";

// This route is a lightweight fallback for server-side extraction.
// The primary OCR runs client-side via tesseract.js in OcrUploader.tsx.
// Use this if you want to add server-side processing (e.g. image preprocessing).

export async function POST(req: NextRequest) {
  const { text } = await req.json(); // Accepts raw OCR text from client

  if (!text) {
    return NextResponse.json({ hash: null, amount: null, currency: "USD" });
  }

  const hash = extractHash(text);
  const amount = extractAmount(text);
  const currency = extractCurrency(text);

  return NextResponse.json({ hash, amount, currency });
}

function extractHash(text: string): string | null {
  const match = text.match(/\b([0-9a-fA-F]{8})\b/);
  return match ? match[1].toLowerCase() : null;
}

function extractAmount(text: string): number | null {
  const patterns = [
    /(?:USD|KHR|\$|៛)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /([\d,]+(?:\.\d{1,2})?)\s*(?:USD|KHR|\$|៛)/i,
    /(?:Amount|Total|ទឹកប្រាក់កាត់ចេញ)[:\s]*([\d,]+(?:\.\d{1,2})?)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number.parseFloat(match[1].replaceAll(/,/g, ""));
  }
  return null;
}

function extractCurrency(text: string): string {
  if (/KHR|៛|riel/i.test(text)) return "KHR";
  return "USD";
}
