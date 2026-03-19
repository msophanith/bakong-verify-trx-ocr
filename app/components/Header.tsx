export default function Header() {
  return (
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
        Upload your transaction or enter details manually
      </p>
    </div>
  );
}
