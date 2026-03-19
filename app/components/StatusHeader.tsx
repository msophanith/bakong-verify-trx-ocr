import { SuccessIcon, ErrorIcon } from "./Icons";

export default function StatusHeader({
  ok,
  message,
}: {
  ok: boolean;
  message: string;
}) {
  const styles = ok
    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
    : "bg-red-500/10 text-red-500 border border-red-500/20";

  return (
    <div className="flex flex-col items-center text-center pb-6 border-b border-white/10">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg ${styles}`}
      >
        {ok ? <SuccessIcon /> : <ErrorIcon />}
      </div>
      <h2 className="text-xl font-semibold mb-1 text-white">
        {ok ? "Bakong Verified" : "Bakong Verification Failed"}
      </h2>
      <p className="text-sm text-white/50">{message}</p>
    </div>
  );
}
