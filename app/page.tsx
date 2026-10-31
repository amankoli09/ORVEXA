"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Navigation Bar - Preserved */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-black/[0.06] bg-white/70 px-4 backdrop-blur-xl sm:px-8">
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
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                AI Study
              </span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="group flex h-9 items-center gap-1.5 rounded-full bg-neutral-950 px-4 text-xs font-medium text-white shadow-xs transition-all hover:bg-neutral-800 hover:shadow-sm"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>

      {/* Main Content: Clean Artwork with Open Dashboard Button */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative flex w-full max-w-4xl flex-col items-center"
        >
          {/* Visual Showcase Card */}
          <Link
            href="/chat"
            className="group relative block w-full overflow-hidden rounded-2xl border border-black/[0.08] bg-neutral-50 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] sm:rounded-3xl"
          >
            <img
              src="/orvexa.png"
              alt="ORVEXA"
              className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
            />

            {/* Subtle Hover Pill */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="flex items-center gap-2 rounded-full bg-neutral-950/90 px-6 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur-md">
                <span>Open Dashboard</span>
                <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>

          {/* Centered Main Call to Action Button */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/chat"
              className="group flex h-12 items-center gap-2 rounded-full bg-neutral-950 px-8 text-sm font-semibold text-white shadow-md transition-all hover:bg-neutral-800 hover:shadow-xl hover:scale-[1.02]"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-xs text-neutral-400">
        <span>© 2026 ORVEXA. All rights reserved.</span>
      </footer>
    </div>
  );
}
