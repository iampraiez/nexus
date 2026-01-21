import React from "react"
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus SDK Demo",
  description: "Interactive demo of the Nexus Analytics SDK",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
