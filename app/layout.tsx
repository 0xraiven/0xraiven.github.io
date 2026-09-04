import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://0xraiven.github.io"),
  title: {
    default: "r41n // Offensive Security & Technical Knowledge Base",
    template: "%s // r41n",
  },
  description: "Cybersecurity portfolio, offensive security research, red team notes, and technical knowledge base.",
  keywords: [
    "Cybersecurity",
    "Offensive Security",
    "Red Team",
    "Cloud Security",
    "Vulnerability Research",
    "r41n",
    "0xraiven",
  ],
  authors: [{ name: "r41n", url: "https://0xraiven.github.io" }],
  creator: "r41n",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://0xraiven.github.io",
    siteName: "r41n Knowledge Base",
    title: "r41n // Offensive Security & Technical Knowledge Base",
    description: "Cybersecurity portfolio, offensive security research, red team notes, and technical knowledge base.",
  },
  twitter: {
    card: "summary_large_image",
    title: "r41n // Offensive Security & Technical Knowledge Base",
    description: "Cybersecurity portfolio, offensive security research, red team notes, and technical knowledge base.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

import { Providers } from "@/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sansFont.variable} ${monoFont.variable} dark`}>
      <body className="min-h-screen bg-bg text-text-primary antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

