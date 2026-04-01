import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTM Engine · AI Outreach Pipeline",
  description: "AI-powered outreach pipeline for GTM teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark">{children}</body>
    </html>
  );
}
