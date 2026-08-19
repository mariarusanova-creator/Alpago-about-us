import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const basel = localFont({
  src: [
    { path: "./fonts/BaselClassic-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/BaselClassic-Medium.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-basel",
  display: "swap",
});

const fedraArabic = localFont({
  src: [
    { path: "./fonts/FedraSansArabic-Book.otf", weight: "400", style: "normal" },
    { path: "./fonts/FedraSansArabic-Medium.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-fedra",
  display: "swap",
});

const social = localFont({
  src: [{ path: "./fonts/ABCSocial-Hairline.otf", weight: "400", style: "normal" }],
  variable: "--font-social",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Alpago — Alpago Properties",
  description: "The Alpago Version 3 standalone experience.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${basel.variable} ${fedraArabic.variable} ${social.variable}`}>
      <body className="grain loading">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
