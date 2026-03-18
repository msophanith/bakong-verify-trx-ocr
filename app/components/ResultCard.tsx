"use client";

import { useState } from "react";

interface TransactionData {
  hash: string;
  fromAccountId: string;
  toAccountId: string;
  currency: string;
  amount: number;
  description: string;
  createdDateMs: number;
  acknowledgedDateMs: number;
  respondedDateMs: number;
}

export interface TransactionResult {
  responseCode: number;
  responseMessage: string;
  errorCode: string | null;
  data: TransactionData | null;
}

export default function ResultCard({
  result,
  onReset,
}: {
  readonly result: TransactionResult;
  readonly onReset: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const ok = result.responseCode === 0;

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error("Failed to copy text", error);
      alert("Failed to copy text");
    }
  };

  const fmtAmt = (n: number, cur: string) =>
    cur === "KHR" ? `${n.toLocaleString()} ៛` : `$${n.toFixed(2)}`;

  const formatDate = (ms: number) => {
    try {
      return new Date(ms).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-white/10">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg ${
            ok
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              : "bg-red-500/10 text-red-500 border border-red-500/20"
          }`}
        >
          {ok ? (
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ) : (
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-1 text-white">
          {ok ? "Bakong Verified" : "Bakong Verification Failed"}
        </h2>
        <p className="text-sm text-white/50">{result.responseMessage}</p>
      </div>

      {result.data ? (
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-1">
              Total Amount
            </div>
            <div
              className={`text-5xl font-semibold tracking-tight ${ok ? "text-white" : "text-white/80"}`}
            >
              {fmtAmt(result.data.amount, result.data.currency)}
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4 shadow-inner">
            {[
              {
                label: "Transaction Hash",
                value: result.data.hash,
                copyable: true,
              },
              {
                label: "From Account",
                value: result.data.fromAccountId,
                copyable: true,
              },
              {
                label: "To Account",
                value: result.data.toAccountId,
                copyable: true,
              },
              {
                label: "Description",
                value: result.data.description || "N/A",
                copyable: !!result.data.description,
              },
              {
                label: "Created Date",
                value: formatDate(result.data.createdDateMs),
                copyable: false,
              },
              {
                label: "Acknowledged Date",
                value: formatDate(result.data.acknowledgedDateMs),
                copyable: false,
              },
            ].map(({ label, value, copyable }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4"
              >
                <span className="text-sm font-medium text-white/40 shrink-0 sm:pt-0.5">
                  {label}
                </span>
                <div className="flex items-start gap-2 group min-w-0 justify-end w-full sm:w-auto">
                  <span className="text-sm text-white font-mono opacity-90 break-all text-left sm:text-right">
                    {value}
                  </span>
                  {copyable && (
                    <button
                      onClick={() => copy(value, label)}
                      className="opacity-50 hover:opacity-100 transition-opacity p-1 text-white hover:text-white"
                      title="Copy"
                    >
                      {copied === label ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="pt-2 flex gap-3">
        <button onClick={onReset} className="btn-secondary flex-1">
          Verify Another
        </button>
        {ok && (
          <button
            onClick={() =>
              navigator.share?.({
                title: "Bakong Transaction Verified",
                text: `Transaction ${result.data?.hash} verified successfully for ${fmtAmt(result.data?.amount || 0, result.data?.currency || "USD")}`,
              })
            }
            className="btn-primary flex-1 bg-white text-black border-none"
          >
            Share Receipt
          </button>
        )}
      </div>
    </div>
  );
}
