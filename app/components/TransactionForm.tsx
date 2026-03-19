"use client";

interface TransactionFormProps {
  hash: string;
  setHash: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
}

export default function TransactionForm({
  hash,
  setHash,
  amount,
  setAmount,
  currency,
  setCurrency,
}: TransactionFormProps) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="hash" className="label-text flex justify-between">
          <span>Bakong Hash (8 chars)</span>
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
  );
}
