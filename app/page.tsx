"use client";

import { useState } from "react";
import OcrUploader from "./components/OcrUploader";
import ResultCard, { type TransactionResult } from "./components/ResultCard";

export default function Home() {
  const [hash, setHash] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExtracted = (data: {
    hash: string;
    amount: string;
    currency: string;
  }) => {
    if (data.hash) setHash(data.hash);
    if (data.amount) setAmount(data.amount);
    if (data.currency) setCurrency(data.currency);
  };

  const handleVerify = async () => {
    if (!hash.trim() || !amount.trim()) {
      setError("Both hash and amount are required");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hash: hash.trim(),
          amount: Number.parseFloat(amount),
          currency,
        }),
      });
      const data: TransactionResult = await res.json();
      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHash("");
    setAmount("");
    setCurrency("USD");
    setResult(null);
    setError("");
  };

  const isComplete = hash.trim().length > 0 && amount.trim().length > 0;

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md animate-in">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-xl backdrop-blur-md"
            style={{
              backgroundImage: "url('/bakong-logo.png')",
              backgroundSize: "60%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            aria-label="Bakong Logo"
          />
          <h1 className="text-3xl font-semibold mb-2 tracking-tight text-white/90">
            Verify Bakong Transaction
          </h1>
          <p className="text-sm text-white/50">
            Upload your receipt or enter details manually
          </p>
        </div>

        {/* Main Card */}
        <div className="premium-card p-6 sm:p-8 mb-6">
          {!result ? (
            <div className="space-y-6">
              <OcrUploader
                onExtracted={handleExtracted}
                onImageChange={() => {}}
              />

              {/* Divider element */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10"></div>
                <div className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">
                  OR ENTER DETAILS
                </div>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="hash"
                    className="label-text flex justify-between"
                  >
                    <span>Transaction Hash</span>
                    <span className="text-white/30 text-xs">8 chars</span>
                  </label>
                  <input
                    id="hash"
                    className="input-premium font-mono"
                    type="text"
                    value={hash}
                    onChange={(e) =>
                      setHash(
                        e.target.value
                          .toLowerCase()
                          .replaceAll(/[^0-9a-f]/g, "")
                          .slice(0, 8),
                      )
                    }
                    placeholder="e.g. 78cde08a"
                    maxLength={8}
                    spellCheck={false}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="amount" className="label-text">
                      Amount
                    </label>
                    <input
                      id="amount"
                      className="input-premium font-mono"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="currency" className="label-text">
                      Currency
                    </label>
                    <div className="relative">
                      <select
                        id="currency"
                        className="input-premium appearance-none cursor-pointer pr-8 font-mono"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                      >
                        <option value="USD">USD</option>
                        <option value="KHR">KHR</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-3">
                  <svg
                    className="mt-0.5 flex-shrink-0"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span className="leading-tight">{error}</span>
                </div>
              )}

              <button
                className="btn-primary mt-4"
                onClick={handleVerify}
                disabled={loading || !isComplete}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
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
                    Verifying...
                  </>
                ) : (
                  "Verify Bakong Transaction"
                )}
              </button>
            </div>
          ) : (
            <ResultCard result={result} onReset={handleReset} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-white/30 space-y-1.5 font-medium">
          <p>
            API from{" "}
            <a
              href="https://api-bakong.nbc.gov.kh/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white"
            >
              Bakong Open API
            </a>
          </p>
          <div className="flex items-center justify-center gap-2">
            <span>
              OCR Verification by <b>tesseract.js</b>
            </span>
            <span>|</span>
            <span>Easy &bull; Secure &bull; Private</span>
          </div>
        </div>
      </div>
    </main>
  );
}
