export default function Footer() {
  return (
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
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        <span>
          OCR Verification with <b>tesseract.js</b>
        </span>
        <span className="hidden sm:inline">|</span>
        <span>Easy &bull; Secure &bull; Private</span>
      </div>
      <p className="pt-2 text-[10px] text-white/20 uppercase tracking-widest">
        Crafted with 🤍 by{" "}
        <a
          href="https://github.com/msophanith/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-white"
        >
          Jay
        </a>
      </p>
    </div>
  );
}
