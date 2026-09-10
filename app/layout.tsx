import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tastemap. — Your Top Tables",
  description:
    "Ranked head-to-head, so your #3 really is better than your #4 — no five-star mush.",
  keywords: ["tastemap", "restaurant ranking", "london food", "head-to-head", "food map"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="h-full w-full overflow-hidden bg-[#FAFAF8] text-[#191917] font-sans">
        {children}
      </body>
    </html>
  );
}
