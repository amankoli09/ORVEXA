import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ORVEXA — AI Study & Revision Assistant",
  description:
    "ORVEXA helps you analyze study notes, diagnose knowledge gaps, and generate actionable revision plans with conversational AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans antialiased", geist.variable)}>
      <body className="min-h-screen bg-background text-foreground selection:bg-neutral-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
