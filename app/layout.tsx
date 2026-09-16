import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "eNtrav Reporting — Travel Spend Dashboard",
  description: "Corporate travel spend analytics for the eNtrav travel management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
