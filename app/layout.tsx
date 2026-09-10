import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tastemap - Interactive Restaurant Ranking & Food Map",
  description:
    "Interactive London restaurant ranking with head-to-head duels, binary search positioning, OpenStreetMap and 'Where Should We Eat' quick tournament.",
  keywords: ["restaurants", "ranking", "food map", "london food", "head-to-head duels", "leaflet", "tastemap"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased dark">
      <body className="h-full w-full overflow-hidden bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
