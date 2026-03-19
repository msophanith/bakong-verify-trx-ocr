import { CopyCheckIcon, CopyIcon } from "./Icons";

export default function DetailRow({
  label,
  value,
  copyable,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copyable: boolean;
  copied: string | null;
  onCopy: (value: string, label: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
      <span className="text-sm font-medium text-white/40 shrink-0 sm:pt-0.5">
        {label}
      </span>
      <div className="flex items-start gap-2 group min-w-0 justify-end w-full sm:w-auto">
        <span className="text-sm text-white font-mono opacity-90 break-all text-left sm:text-right">
          {value}
        </span>
        {copyable && (
          <button
            onClick={() => onCopy(value, label)}
            className="opacity-50 hover:opacity-100 transition-opacity p-1 text-white hover:text-white"
            title="Copy"
          >
            {copied === label ? <CopyCheckIcon /> : <CopyIcon />}
          </button>
        )}
      </div>
    </div>
  );
}
