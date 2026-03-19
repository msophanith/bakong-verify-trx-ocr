import type { Metadata } from "next";
import { Oxanium } from "next/font/google";

import "./globals.css";
import bakongLogo from "@/public/bakong-logo.png";

const oxanium = Oxanium({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oxanium",
});

export const metadata: Metadata = {
  title: "Bakong Verifier · NBC Cambodia",
  description: "Verify Bakong payment transactions instantly",
  openGraph: {
    title: "Bakong Verifier · NBC Cambodia",
    description: "Verify Bakong payment transactions instantly",
    url: "https://verifybakongtrx.vercel.app/",
    siteName: "Bakong Verifier",
    images: [
      {
        url: bakongLogo.src,
        width: bakongLogo.width,
        height: bakongLogo.height,
        alt: "Bakong Verifier",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${oxanium.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
