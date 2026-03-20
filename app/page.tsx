"use client";

import { useState } from "react";
import OcrUploader from "./components/OcrUploader";
import ResultCard from "./components/ResultCard";
import type { TransactionResult } from "./types";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TransactionForm from "./components/TransactionForm";

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
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BAKONG_API_TOKEN}`,
        },
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
        <Header />

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

              <TransactionForm
                hash={hash}
                setHash={setHash}
                amount={amount}
                setAmount={setAmount}
                currency={currency}
                setCurrency={setCurrency}
              />

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-3">
                  <svg
                    className="mt-0.5 shrink-0"
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

        <Footer />
      </div>
    </main>
  );
}
