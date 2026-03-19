import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // Switch to Edge runtime to bypass some IP-based WAF blocks on Vercel

export async function POST(req: NextRequest) {
  const { hash, amount, currency } = await req.json();

  if (!hash || amount === undefined || !currency) {
    return NextResponse.json(
      { error: "Missing required fields: hash, amount, currency" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      "https://api-bakong.nbc.gov.kh/local/v1/check_transaction_by_short_hash",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          Origin: "https://api-bakong.nbc.gov.kh",
          Referer: "https://api-bakong.nbc.gov.kh/",
          "Sec-Ch-Ua":
            '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"macOS"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
        body: JSON.stringify({ hash, amount, currency }),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Bakong API error: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Bakong API error:", err);
    return NextResponse.json(
      { error: "Failed to reach Bakong API" },
      { status: 500 },
    );
  }
}
