import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRD — Menlo Cobrança",
  description: "PRD com 12 etapas, 161 features e 144 prints",
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
