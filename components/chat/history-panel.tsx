"use client";

import { X, Trash2, Clock, MessageSquare } from "lucide-react";
import type { ChatSession } from "@/hooks/use-chat-history";

interface HistoryPanelProps {
  sessions: ChatSession[];
  open: boolean;
  onClose: () => void;
  onLoadSession: (session: ChatSession) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function HistoryPanel({
  sessions,
  open,
  onClose,
  onLoadSession,
  onDeleteSession,
  onClearAll,
}: HistoryPanelProps) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px]"
          onClick={onClose}
        />
      )}

      {/* Slide-in panel */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-neutral-200/80 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-100 px-4">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-neutral-500" />
            <span className="text-sm font-semibold text-neutral-800">Chat History</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close history"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto py-2">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
              <MessageSquare className="size-8 text-neutral-300" />
              <p className="text-xs text-neutral-400">No previous chats yet.</p>
              <p className="text-xs text-neutral-300">Start a conversation to see it here.</p>
            </div>
          ) : (
            <ul className="space-y-0.5 px-2">
              {sessions.map((session) => (
                <li key={session.id} className="group relative">
                  <button
                    onClick={() => {
                      onLoadSession(session);
                      onClose();
                    }}
                    className="w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-neutral-100"
                  >
                    <p className="truncate text-xs font-medium text-neutral-800 pr-6">
                      {session.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="text-[10px] text-neutral-400">
                        {formatDate(session.createdAt)}
                      </span>
                      <span className="text-[10px] text-neutral-300">·</span>
                      <span className="text-[10px] text-neutral-400">
                        {session.messages.length} msg{session.messages.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-rose-500"
                    aria-label="Delete session"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — clear all */}
        {sessions.length > 0 && (
          <div className="shrink-0 border-t border-neutral-100 p-3">
            <button
              onClick={() => {
                if (confirm("Clear all chat history? This cannot be undone.")) {
                  onClearAll();
                }
              }}
              className="w-full rounded-lg px-3 py-2 text-xs font-medium text-neutral-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              Clear all history
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
