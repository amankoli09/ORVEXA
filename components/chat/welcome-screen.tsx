"use client";

import {
  FileText,
  Target,
  CalendarCheck,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "motion/react";

interface SuggestedPrompt {
  id: string;
  title: string;
  badge: string;
  description: string;
  prompt: string;
  mode: string;
  icon: typeof FileText;
}

const suggestedPrompts: SuggestedPrompt[] = [
  {
    id: "analyze-notes",
    title: "Analyze my notes",
    badge: "Notes Diagnostic",
    description: "Find missing definitions and unclear concepts.",
    prompt:
      "Analyze my study notes. Identify any missing conceptual explanations, confusing formulas, or gaps that need clarification.",
    mode: "gap-audit",
    icon: FileText,
  },
  {
    id: "find-gaps",
    title: "Find my knowledge gaps",
    badge: "Gap Detection",
    description: "Spot the topics that need revision first.",
    prompt:
      "Find my knowledge gaps across my current syllabus. What high-yield topics or connections am I likely overlooking?",
    mode: "gap-audit",
    icon: Target,
  },
  {
    id: "revision-plan",
    title: "Create a revision plan",
    badge: "Study Roadmap",
    description: "Get a spaced schedule for your exam date.",
    prompt:
      "Create a step-by-step revision plan for my upcoming exam, focusing on high-yield topics and active recall.",
    mode: "revision-plan",
    icon: CalendarCheck,
  },
];

interface WelcomeScreenProps {
  onSelectPrompt: (promptText: string, mode?: string) => void;
}

export function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center px-5 py-10 sm:py-14">
      <div className="mx-auto flex w-full max-w-[40rem] flex-col items-center text-center">
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center gap-2"
        >
          <img
            src="/logo.png"
            alt="AI Revision Gap Analyzer Logo"
            className="size-9 object-contain"
          />
        </motion.div>

        {/* Heading & subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <h2 className="mt-4 text-[1.8rem] leading-[1.1] font-normal tracking-[-0.02em] text-neutral-950 sm:text-[2rem]">
            What are we mastering today?
          </h2>
          <p className="mt-2 max-w-[24rem] text-[12px] leading-relaxed text-neutral-500 sm:text-sm">
            Paste notes → diagnose gaps → revise smarter.
          </p>
        </motion.div>

        {/* Suggested prompts */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
          className="mt-11 w-full text-left"
        >
          <div className="mb-2.5 flex items-baseline justify-between px-1">
            <span className="text-[10px] font-medium tracking-[0.14em] text-neutral-400 uppercase">
              Suggested prompts
            </span>
            <span className="text-[11px] text-neutral-400">Click to run</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {suggestedPrompts.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectPrompt(item.prompt, item.mode)}
                  className="group flex flex-col gap-2 rounded-2xl border border-black/[0.06] bg-white/70 p-3.5 text-left backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-black/10 hover:bg-white hover:shadow-[0_10px_30px_-14px_rgba(15,23,42,0.28)] focus-visible:ring-2 focus-visible:ring-neutral-900/20 focus-visible:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="size-4 text-neutral-700" />
                    <ArrowUpRight className="size-3.5 text-neutral-300 transition-colors group-hover:text-neutral-700" />
                  </div>
                  <div>
                    <span className="text-[10px] tracking-[0.1em] text-neutral-400 uppercase">
                      {item.badge}
                    </span>
                    <h3 className="mt-0.5 text-[13px] font-medium text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-500">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Feature line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-3 text-[10px] text-neutral-400"
        >
          Diagnose · Revise · Retain
        </motion.p>
      </div>
    </div>
  );
}
