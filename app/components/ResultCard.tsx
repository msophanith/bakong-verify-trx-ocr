"use client";

import { useState } from "react";
import type { TransactionResult } from "../types";
import StatusHeader from "./StatusHeader";
import DetailRow from "./DetailRow";

interface ResultCardProps {
  readonly result: TransactionResult;
  readonly onReset: () => void;
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const ok = result.responseCode === 0;

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error("Failed to copy text", error);
      alert("Failed to copy text");
    }
  };

  const formatAmount = (n: number, cur: string) =>
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

  const handleShare = async () => {
    if (!result.data) return;
    const shareText = `Transaction ${result.data.hash} verified successfully for ${formatAmount(
      result.data.amount,
      result.data.currency,
    )}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Bakong Transaction Verified",
          text: shareText,
        });
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      handleCopy(shareText, "share");
    }
  };

  return (
    <div className="space-y-6">
      <StatusHeader ok={ok} message={result.responseMessage} />

      {result.data && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-1">
              Total Amount
            </div>
            <div
              className={`text-5xl font-semibold tracking-tight ${
                ok ? "text-white" : "text-white/80"
              }`}
            >
              {formatAmount(result.data.amount, result.data.currency)}
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4 shadow-inner">
            {[
              { label: "Bakong Hash", value: result.data.hash, copyable: true },
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
            ].map((detail) => (
              <DetailRow
                key={detail.label}
                {...detail}
                copied={copied}
                onCopy={handleCopy}
              />
            ))}
          </div>
        </div>
      )}

      <div className="pt-2 flex gap-3">
        <button onClick={onReset} className="btn-secondary flex-1">
          Verify Another
        </button>
        {ok && (
          <button
            onClick={handleShare}
            className="btn-primary flex-1 bg-white text-black border-none"
          >
            Share Transaction
          </button>
        )}
      </div>
    </div>
  );
}
