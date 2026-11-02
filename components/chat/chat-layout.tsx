"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChatHeader } from "@/components/chat/chat-header";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import {
  ChatMessages,
  type ChatMessageItem,
} from "@/components/chat/chat-messages";
import {
  MessageComposer,
  type AttachedFile,
} from "@/components/chat/message-composer";
import { HistoryPanel } from "@/components/chat/history-panel";
import { MessageScroller } from "@/components/agents/message-scroller";
import { callGeminiApi } from "@/lib/gemini";
import { useChatHistory, type ChatSession } from "@/hooks/use-chat-history";

export function ChatLayout() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [pending, setPending] = useState(false);
  const [prefilledInput, setPrefilledInput] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const sessionIdRef = useRef<string>("");

  const { sessions, saveSession, deleteSession, clearAll } = useChatHistory();

  // Auto-save session whenever messages change
  useEffect(() => {
    if (messages.length === 0) return;
    const id = saveSession(messages, sessionIdRef.current || undefined);
    if (id) sessionIdRef.current = id;
  }, [messages, saveSession]);

  const handleReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages([]);
    setPending(false);
    setPrefilledInput("");
    sessionIdRef.current = "";
  }, []);

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setPending(false);
  }, []);

  /** Load a past session back into the chat */
  const handleLoadSession = useCallback((session: ChatSession) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setPending(false);
    sessionIdRef.current = session.id;
    setMessages(session.messages);
  }, []);

  const handleSendMessage = async (
    content: string,
    mode: string,
    attachment?: AttachedFile
  ) => {
    const trimmed = content.trim();
    if (!trimmed && !attachment) return;

    // Abort any ongoing request before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Add user message to UI state
    const userMessage: ChatMessageItem = {
      id: `user-${Date.now()}`,
      from: "user",
      content: trimmed || (attachment ? `Uploaded file: ${attachment.name}` : ""),
      timestamp: "Just now",
      attachment,
    };

    const previousMessages = [...messages];
    setMessages((prev) => [...prev, userMessage]);
    setPending(true);

    // Format prompt and respect honest file content processing
    let promptWithAttachment = trimmed;
    if (attachment) {
      if (attachment.content) {
        // Text/markdown file whose contents were successfully extracted
        promptWithAttachment = promptWithAttachment
          ? `${promptWithAttachment}\n\n---\n[Attached File Content: "${attachment.name}" (${attachment.size})]\n${attachment.content}`
          : `[Attached File Content: "${attachment.name}" (${attachment.size})]\n${attachment.content}`;
      } else {
        // Binary document without in-browser parsing
        const notice = `[The user uploaded a document called "${attachment.name}" (${attachment.size}). You cannot read binary file contents in this environment, but acknowledge that the file was received. If the user wants you to analyze its contents, kindly let them know they can paste the text or upload a .txt / .md version — then help them with whatever they need.]`;
        promptWithAttachment = promptWithAttachment
          ? `${promptWithAttachment}\n\n---\n${notice}`
          : `I uploaded "${attachment.name}" (${attachment.size}).\n\n${notice}`;
      }
    }

    // Prepare conversation history for Gemini
    const history = previousMessages
      .filter((m) => !m.isError && m.content.trim().length > 0)
      .map((m) => ({
        role: m.from,
        content: m.content,
      }));

    try {
      const responseText = await callGeminiApi({
        history,
        prompt: promptWithAttachment,
        mode,
        signal: controller.signal,
      });

      const assistantMessage: ChatMessageItem = {
        id: `assistant-${Date.now()}`,
        from: "assistant",
        content: responseText,
        timestamp: "Just now",
        streaming: false,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      const errorMessage: ChatMessageItem = {
        id: `assistant-err-${Date.now()}`,
        from: "assistant",
        content:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while communicating with Gemini API.",
        timestamp: "Just now",
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setPending(false);
      abortControllerRef.current = null;
    }
  };

  const handleSelectPrompt = (promptText: string, mode: string = "gap-audit") => {
    handleSendMessage(promptText, mode);
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* History slide-in panel */}
      <HistoryPanel
        sessions={sessions}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onLoadSession={handleLoadSession}
        onDeleteSession={deleteSession}
        onClearAll={clearAll}
      />

      <div className="flex h-screen w-full flex-col bg-white text-neutral-900 overflow-hidden font-sans antialiased">
        {/* Header */}
        <ChatHeader
          onReset={handleReset}
          hasMessages={hasMessages}
          onToggleHistory={() => setHistoryOpen((v) => !v)}
        />

        {/* Main chat viewport */}
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          {hasMessages ? (
            <MessageScroller
              className="min-h-0 flex-1"
              viewportClassName="px-4 py-6 sm:px-6"
              contentClassName="mx-auto w-full max-w-3xl"
            >
              <ChatMessages messages={messages} pending={pending} />
            </MessageScroller>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <WelcomeScreen onSelectPrompt={handleSelectPrompt} />
            </div>
          )}
        </div>

        {/* Centered bottom Message Composer */}
        <MessageComposer
          onSendMessage={handleSendMessage}
          loading={pending}
          onStop={handleStop}
          prefilledValue={prefilledInput}
        />
      </div>
    </>
  );
}
