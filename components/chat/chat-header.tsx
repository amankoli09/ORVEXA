"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onReset: () => void;
  hasMessages: boolean;
}

export function ChatHeader({ onReset, hasMessages }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full shrink-0 items-center justify-between gap-4 border-b border-black/[0.06] bg-white/55 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-2.5">
        <img
          src="/logo.png"
          alt="AI Revision Gap Analyzer Logo"
          className="size-7 shrink-0 rounded-lg object-contain"
        />
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-[13px] font-medium tracking-tight text-neutral-900 sm:text-sm">
            AI Revision Gap Analyzer
          </h1>
          <p className="truncate text-[11px] text-neutral-500">
            Diagnose gaps · Revise smarter
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {hasMessages && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 gap-1.5 rounded-full px-3 text-xs font-medium text-neutral-600 hover:bg-black/[0.04] hover:text-neutral-900"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        )}
      </div>
    </header>
  );
}
