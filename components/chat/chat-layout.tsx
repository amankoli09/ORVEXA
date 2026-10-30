"use client";

import { useState, useRef, useCallback } from "react";
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
import { MessageScroller } from "@/components/agents/message-scroller";
import { callGeminiApi } from "@/lib/gemini";

export function ChatLayout() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [pending, setPending] = useState(false);
  const [prefilledInput, setPrefilledInput] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages([]);
    setPending(false);
    setPrefilledInput("");
  }, []);

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setPending(false);
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
        const notice = `[Notice: The user attached "${attachment.name}" (${attachment.size}), which is a binary document format without plain text extraction. Please let the user know they can paste the text directly or upload a .txt/.md file if they want its exact contents analyzed.]`;
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
    <div className="flex h-screen w-full flex-col bg-white text-neutral-900 overflow-hidden font-sans antialiased">
      {/* Centered clean header */}
      <ChatHeader onReset={handleReset} hasMessages={hasMessages} />

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
  );
}
