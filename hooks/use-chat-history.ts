"use client";

import { useState, useEffect, useCallback } from "react";
import type { ChatMessageItem } from "@/components/chat/chat-messages";

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessageItem[];
}

const STORAGE_KEY = "orvexa_chat_history";
const MAX_SESSIONS = 30;

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatSession[]) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Storage full — remove oldest and retry
    const trimmed = sessions.slice(0, MAX_SESSIONS - 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }
}

/** Derives a short title from the first user message */
function deriveTitle(messages: ChatMessageItem[]): string {
  const first = messages.find((m) => m.from === "user");
  if (!first) return "New Chat";
  const text = first.content.trim().replace(/\s+/g, " ");
  return text.length > 50 ? text.slice(0, 50) + "…" : text;
}

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount (client only)
  useEffect(() => {
    setSessions(loadSessions());
    setLoaded(true);
  }, []);

  /** Saves the current conversation as a session. Returns the session id. */
  const saveSession = useCallback(
    (messages: ChatMessageItem[], existingId?: string): string => {
      if (messages.length === 0) return existingId ?? "";

      const all = loadSessions();
      const id = existingId ?? `session-${Date.now()}`;
      const title = deriveTitle(messages);

      const updated = all.filter((s) => s.id !== id);
      const session: ChatSession = {
        id,
        title,
        createdAt: Date.now(),
        messages,
      };

      const next = [session, ...updated].slice(0, MAX_SESSIONS);
      saveSessions(next);
      setSessions(next);
      return id;
    },
    []
  );

  /** Deletes a session by id */
  const deleteSession = useCallback((id: string) => {
    const next = loadSessions().filter((s) => s.id !== id);
    saveSessions(next);
    setSessions(next);
  }, []);

  /** Clears all history */
  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSessions([]);
  }, []);

  return { sessions, loaded, saveSession, deleteSession, clearAll };
}
