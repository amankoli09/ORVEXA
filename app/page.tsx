"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Target,
  FileText,
  CalendarCheck,
  CheckCircle2,
  Zap,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Navigation */}
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

        <nav className="hidden items-center gap-6 text-xs font-medium text-neutral-600 md:flex">
          <a href="#features" className="transition-colors hover:text-neutral-950">
            Features
          </a>
          <a href="#modes" className="transition-colors hover:text-neutral-950">
            Study Modes
          </a>
          <a href="#workflow" className="transition-colors hover:text-neutral-950">
            How It Works
          </a>
        </nav>

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

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-neutral-50/80 px-3.5 py-1 text-xs text-neutral-700 backdrop-blur-sm"
          >
            <Sparkles className="size-3.5 text-neutral-900" />
            <span className="font-medium">AI Revision Gap Analyzer</span>
            <span className="text-neutral-400">·</span>
            <span className="text-neutral-500">Gemini Powered</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-6 text-4xl font-normal tracking-[-0.03em] text-neutral-950 sm:text-6xl sm:leading-[1.1]"
          >
            Master your syllabus.
            <br />
            <span className="font-semibold text-neutral-950">
              Uncover hidden knowledge gaps.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base sm:leading-relaxed"
          >
            Upload study notes, paste syllabus modules, or audit your exam retention.
            ORVEXA detects what you understand, flags what you are missing, and builds an
            adaptive revision plan tailored to your exam timeline.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/chat"
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 text-sm font-medium text-white shadow-md transition-all hover:bg-neutral-800 hover:shadow-lg sm:w-auto"
            >
              <span>Open Chat Dashboard</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <a
              href="#features"
              className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full border border-black/[0.1] bg-white px-5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 sm:w-auto"
            >
              <span>Explore Features</span>
            </a>
          </motion.div>

          {/* Feature Micro-Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-500"
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-neutral-800" />
              Notes & Syllabus Diagnostics
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-neutral-800" />
              Spaced Revision Roadmaps
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-neutral-800" />
              Zero fluff, pure exam yield
            </span>
          </motion.div>

          {/* Hero Image Showcase (Using orvexa.png) */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.38, ease: "easeOut" }}
            className="relative mx-auto mt-12 max-w-4xl"
          >
            <div className="group relative overflow-hidden rounded-2xl border border-black/[0.08] bg-neutral-50 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] sm:rounded-3xl sm:p-3">
              <div className="overflow-hidden rounded-xl bg-white sm:rounded-2xl">
                <img
                  src="/orvexa.png"
                  alt="ORVEXA AI Revision Gap Analyzer Interface"
                  className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </div>

              {/* Hover overlay hint button */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/5 group-hover:opacity-100">
                <Link
                  href="/chat"
                  className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-xs font-semibold text-neutral-900 shadow-xl backdrop-blur-md transition-transform hover:scale-105"
                >
                  <span>Launch Live Dashboard</span>
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3 Core Study Modes */}
      <section id="modes" className="border-t border-black/[0.06] bg-neutral-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
              Three Specialized Engines
            </span>
            <h2 className="mt-2 text-2xl font-normal tracking-[-0.02em] text-neutral-950 sm:text-3xl">
              Targeted revision modes for every study session
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xs text-neutral-500 sm:text-sm">
              Switch analysis modes in one click to match exactly what you need.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Mode 1 */}
            <div className="flex flex-col justify-between rounded-2xl border border-black/[0.08] bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md">
              <div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                  <Target className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-neutral-950">
                  Gap Audit Mode
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Detects missing definitions, unexplained formula parameters, edge cases,
                  and prerequisites you might be missing before test day.
                </p>
              </div>
              <div className="mt-6 border-t border-neutral-100 pt-4">
                <span className="text-[11px] font-medium text-neutral-400">
                  Best for: Practice exams & notes check
                </span>
              </div>
            </div>

            {/* Mode 2 */}
            <div className="flex flex-col justify-between rounded-2xl border border-black/[0.08] bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md">
              <div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                  <Zap className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-neutral-950">
                  Quick Summary
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Distills long lecture slides and textbook chapters into clear, high-yield
                  takeaways, bulleted formulas, and exam cheat sheets.
                </p>
              </div>
              <div className="mt-6 border-t border-neutral-100 pt-4">
                <span className="text-[11px] font-medium text-neutral-400">
                  Best for: Fast recap & definition reviews
                </span>
              </div>
            </div>

            {/* Mode 3 */}
            <div className="flex flex-col justify-between rounded-2xl border border-black/[0.08] bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md">
              <div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                  <CalendarCheck className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-neutral-950">
                  Revision Planner
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Builds personalized day-by-day revision schedules prioritizing your weakest
                  topics first based on your exam date and study hours.
                </p>
              </div>
              <div className="mt-6 border-t border-neutral-100 pt-4">
                <span className="text-[11px] font-medium text-neutral-400">
                  Best for: Exam countdown & spaced retention
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Workflow */}
      <section id="workflow" className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
              Simple 3-Step Process
            </span>
            <h2 className="mt-2 text-2xl font-normal tracking-[-0.02em] text-neutral-950 sm:text-3xl">
              From study notes to exam readiness
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="relative flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white font-mono text-sm font-semibold text-neutral-900 shadow-xs">
                01
              </div>
              <h3 className="mt-4 text-sm font-semibold text-neutral-950 sm:text-base">
                Provide Your Notes
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                Upload `.txt` / `.md` notes with the attachment button or paste your syllabus
                directly into the message input.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white font-mono text-sm font-semibold text-neutral-900 shadow-xs">
                02
              </div>
              <h3 className="mt-4 text-sm font-semibold text-neutral-950 sm:text-base">
                Diagnose Knowledge Gaps
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                ORVEXA conducts an audit, flags conceptual blind spots, and highlights the
                exact topics requiring clarification.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white font-mono text-sm font-semibold text-neutral-900 shadow-xs">
                03
              </div>
              <h3 className="mt-4 text-sm font-semibold text-neutral-950 sm:text-base">
                Follow Your Roadmap
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                Execute structured daily revision milestones with high-yield active recall
                drills and exam review techniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="border-t border-black/[0.06] bg-neutral-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">
            <Sparkles className="size-3 text-white" />
            <span>Ready to boost your revision?</span>
          </div>

          <h2 className="mt-4 text-3xl font-normal tracking-[-0.02em] sm:text-4xl">
            Start auditing your syllabus with ORVEXA today.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs text-neutral-400 sm:text-sm">
            Experience conversational gap diagnostics, high-yield summaries, and adaptive
            revision plans in a distraction-free white theme.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/chat"
              className="group flex h-12 items-center gap-2 rounded-full bg-white px-8 text-sm font-semibold text-neutral-950 shadow-lg transition-all hover:bg-neutral-100 hover:shadow-xl"
            >
              <span>Open Chat Dashboard</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] bg-white py-8 text-xs text-neutral-500">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ORVEXA Logo" className="size-5 object-contain" />
            <span className="font-semibold text-neutral-900">ORVEXA</span>
            <span>· AI Revision Gap Analyzer</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/chat" className="transition-colors hover:text-neutral-900">
              Dashboard
            </Link>
            <a
              href="https://github.com/amankoli09/ORVEXA"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-neutral-900"
            >
              GitHub
            </a>
          </div>

          <div>
            <span>© 2026 ORVEXA. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
