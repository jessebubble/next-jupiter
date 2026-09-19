import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

// Serif for the names, wide-tracked sans for the details — the pairing on the
// printed invitation. next/font self-hosts both, so the TV never needs Google.
const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "block",
});

const detail = Jost({
  variable: "--font-detail",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "block",
});

export const metadata: Metadata = {
  title: "Brianna & Jupiter",
  description: "We got engaged!",
};

export const viewport: Viewport = {
  themeColor: "#14100f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${detail.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
