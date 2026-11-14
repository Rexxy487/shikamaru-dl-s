import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shikamaru PDF417 Studio",
  description:
    "Generate, customize, scan, and export PDF417 barcodes with a complete browser-based toolkit.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
