# 🏦 Bakong Transaction Verifier

A sleek Next.js 16 app to verify Bakong (NBC Cambodia) payments.  
Upload a receipt → OCR reads the hash → verified instantly against the Bakong API.

**No API keys required.** OCR is 100% free via Tesseract.js (runs in-browser).

---

## Project Structure

```
bakong-verifier/
│
├── .env.local.example              ← no keys needed
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
│
└── app/
    ├── layout.tsx                  ← root layout + fonts
    ├── globals.css                 ← design tokens, animations
    ├── page.tsx                    ← main page (3-step UI)
    │
    ├── _components/
    │   ├── OcrUploader.tsx         ← drag/drop + tesseract.js OCR
    │   └── ResultCard.tsx          ← verification result display
    │
    └── api/
        ├── verify/
        │   └── route.ts            ← POST /api/verify → Bakong NBC API
        └── extract/
            └── route.ts            ← POST /api/extract → server-side text parsing
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Run dev server (no .env needed)
npm run dev

# 3. Open browser
open http://localhost:3000
```

---

## How It Works

```
Step 1: Upload receipt image (drag/drop or click)
            ↓
        OcrUploader.tsx
        tesseract.js runs in-browser
        extracts hash, amount, currency
            ↓
Step 2: Review extracted fields
        edit if needed
            ↓
Step 3: Click "Verify Transaction"
            ↓
        /api/verify
        proxies to api-bakong.nbc.gov.kh
            ↓
        ResultCard.tsx shows result
```

---

## API Routes

| Route          | Method | Input                        | What it does                              |
| -------------- | ------ | ---------------------------- | ----------------------------------------- |
| `/api/verify`  | POST   | `{ hash, amount, currency }` | Calls Bakong NBC API, returns transaction |
| `/api/extract` | POST   | `{ text }`                   | Server-side text parsing (fallback)       |

---

## Tech Stack

- **Next.js 16** — App Router
- **Tesseract.js 5** — Free in-browser OCR
- **Tailwind CSS 4** — Styling
- **Bakong NBC API** — Public, no auth required
- **TypeScript** — Full type safety
