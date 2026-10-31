"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function LandingPage() {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Full-bleed Background Image covering the entire landing screen */}
      <div className="absolute inset-0 z-0">
        <img
          src="/orvexa.png"
          alt="ORVEXA Background"
          className="size-full object-cover object-center"
        />
        {/* Subtle overlay for contrast */}
        <div className="absolute inset-0 bg-black/[0.03]" />
      </div>

      {/* Navigation Bar - Preserved and glassmorphic on top */}
      <header className="relative z-20 flex h-16 w-full items-center justify-between border-b border-black/[0.06] bg-white/60 px-4 backdrop-blur-xl sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-85">
          <img
            src="/logo.png"
            alt="ORVEXA Logo"
            className="size-8 rounded-lg object-contain"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight text-neutral-950 sm:text-base">
                ORVEXA
              </span>
              <span className="rounded-full bg-neutral-100/90 px-2 py-0.5 text-[10px] font-medium text-neutral-700 backdrop-blur-sm">
                AI Study
              </span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="group flex h-9 items-center gap-1.5 rounded-full bg-neutral-950 px-4 text-xs font-medium text-white shadow-sm transition-all hover:bg-neutral-800 hover:shadow-md"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>

      {/* Centered Button on top of the full background */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-end pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <Link
            href="/chat"
            className="group flex h-13 items-center gap-2.5 rounded-full bg-neutral-950/95 px-8 text-sm font-semibold text-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-neutral-950 hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.45)] sm:text-base"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
