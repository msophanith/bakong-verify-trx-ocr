import { NextRequest, NextResponse } from "next/server";

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
          accept: "application/json, text/plain, */*",
          origin: "https://api-bakong.nbc.gov.kh",
          referer: "https://api-bakong.nbc.gov.kh/",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
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
