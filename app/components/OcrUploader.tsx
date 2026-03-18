"use client";

import { useRef, useState, useCallback } from "react";
import Tesseract from "tesseract.js";
import Image from "next/image";

interface ExtractedData {
  hash: string;
  amount: string;
  currency: string;
}

interface Props {
  readonly onExtracted: (data: ExtractedData) => void;
  readonly onImageChange: (src: string | null) => void;
}

export default function OcrUploader({ onExtracted, onImageChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setPreview(src);
        onImageChange(src);
      };
      reader.readAsDataURL(file);

      setScanning(true);
      setProgress(0);

      try {
        const {
          data: { text },
        } = await Tesseract.recognize(file, "eng", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setProgress(Math.round(m.progress * 100));
            }
          },
        });

        onExtracted({
          hash: extractHash(text),
          amount: extractAmount(text),
          currency: extractCurrency(text),
        });
      } catch {
        onExtracted({ hash: "", amount: "", currency: "USD" });
      } finally {
        setScanning(false);
        setProgress(0);
      }
    },
    [onExtracted, onImageChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const clear = () => {
    setPreview(null);
    onImageChange(null);
    onExtracted({ hash: "", amount: "", currency: "USD" });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => !scanning && fileRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!scanning) fileRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`drop-zone relative overflow-hidden ${
          isDragging ? "active" : ""
        } ${scanning ? "cursor-wait" : "cursor-pointer"} ${
          preview ? "p-3" : "p-8 min-h-[160px]"
        } flex flex-col items-center justify-center`}
      >
        {preview ? (
          <div className="relative w-full rounded-2xl overflow-hidden group shadow-inner bg-black/50">
            <Image
              src={preview}
              alt="Receipt preview"
              width={400}
              height={400}
              className={`w-full max-h-48 object-contain object-center transition-all duration-300 ${
                scanning
                  ? "opacity-20 blur-md scale-105"
                  : "opacity-100 hover:scale-105"
              }`}
            />

            {scanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <svg
                  className="animate-spin h-10 w-10 text-white mb-4 drop-shadow-lg"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <div className="text-white font-medium text-sm drop-shadow-md">
                  Scanning Receipt... {progress}%
                </div>
                <div className="w-32 h-1.5 bg-white/20 rounded-full mt-4 overflow-hidden backdrop-blur-sm shadow-inner">
                  <div
                    className="h-full bg-white transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {!scanning && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clear();
                  }}
                  className="bg-white hover:bg-white/90 text-black border-none rounded-full px-5 py-2.5 text-sm font-semibold transition-transform duration-200 hover:scale-105 shadow-xl"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-white/5 mx-auto flex items-center justify-center text-white/60 shadow-inner border border-white/5">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white/80 mb-1">
                Upload Bakong Receipt
              </p>
              <p className="text-xs text-white/40 font-medium">
                Drag &amp; drop or click to browse
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function extractHash(text: string): string {
  const patterns = [
    /(?:hash|id|transaction|tx)[:\s]*([0-9a-fA-F]{8})\b/i,
    /\b([0-9a-fA-F]{8})\b/g,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match)
      return pattern.global
        ? Array.from(text.matchAll(pattern))[0][1]?.toLowerCase() || ""
        : match[1].toLowerCase();
  }
  return "";
}

function extractAmount(text: string): string {
  const patterns = [
    /(?:USD|KHR|\$|៛)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /([\d,]+(?:\.\d{1,2})?)\s*(?:USD|KHR|\$|៛)/i,
    /(?:Amount|Total|Original|Sum)[:\s]*([\d,]+(?:\.\d{1,2})?)/i,
    /(?:Pay|Send|Transfer)[:\s]*([\d,]+(?:\.\d{1,2})?)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const num = parseFloat(match[1].replace(/,/g, ""));
      if (num > 0 && num < 1000000000) return match[1].replace(/,/g, "");
    }
  }
  return "";
}

function extractCurrency(text: string): string {
  if (text.match(/\b(?:KHR|៛|riel|riels)\b/i)) return "KHR";
  if (text.match(/\b(?:USD|\$|dollar|dollars)\b/i)) return "USD";
  return "USD";
}
