import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

// App-wide typeface — see README.md ("Fonts").
const primaryFont = Manrope({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Build your bundle — Wyze Security System Builder",
  description:
    "Assemble your Wyze security system and review your personalized protection bundle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${primaryFont.variable} h-full antialiased`}>
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
