import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRD Interativa — Menlo Cobrança",
  description: "PRD Interativa com 12 etapas, 161 features e 144 prints",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
