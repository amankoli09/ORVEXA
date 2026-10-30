"use client";

import {
  User,
  Sparkles,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
  MessageHeader,
} from "@/components/agents/message";
import {
  MessageBubble,
  MessageBubbleContent,
} from "@/components/agents/message-bubble";
import { StreamingResponse } from "@/components/agents/streaming-response";
import { AgentActivity, type AgentActivityItem } from "@/components/agents/agent-activity";
import { TodoList, type TodoItem } from "@/components/agents/todo-list";
import { ThinkingShimmer } from "@/components/agents/loading-states/thinking-shimmer";
import {
  GapAnalyzerCard,
  type GapDiagnosticData,
} from "@/components/chat/gap-analyzer-card";
import type { AttachedFile } from "@/components/chat/message-composer";

export interface ChatMessageItem {
  id: string;
  from: "user" | "assistant";
  content: string;
  timestamp: string;
  streaming?: boolean;
  attachment?: AttachedFile;
  isError?: boolean;
  activityItems?: AgentActivityItem[];
  activityDuration?: number;
  gapDiagnostic?: GapDiagnosticData;
  revisionPlan?: TodoItem[];
}

interface ChatMessagesProps {
  messages: ChatMessageItem[];
  pending?: boolean;
}

export function ChatMessages({ messages, pending = false }: ChatMessagesProps) {
  return (
    <div className="w-full">
      <MessageGroup spacing="default" className="space-y-6">
        {messages.map((message) => (
          <Message key={message.id} from={message.from} animateIn className="group">
            {message.from === "assistant" ? (
              <MessageAvatar className="size-8 rounded-full border border-neutral-200 bg-white shadow-2xs overflow-hidden">
                <img
                  src="/logo.png"
                  alt="ORVEXA"
                  className="size-full object-contain p-0.5"
                />
              </MessageAvatar>
            ) : (
              <MessageAvatar className="size-8 rounded-full border border-neutral-200 bg-neutral-100 text-neutral-700 shadow-2xs">
                <User className="size-4" />
              </MessageAvatar>
            )}

            <MessageContent className="gap-2 max-w-full">
              <MessageHeader className="text-xs text-neutral-400 font-medium">
                <span>{message.from === "assistant" ? "ORVEXA" : "You"}</span>
                <span>{message.timestamp}</span>
              </MessageHeader>

              {/* If user attached a file */}
              {message.attachment && (
                <div className="mb-1 inline-flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-700">
                  <FileText className="size-3.5 text-neutral-500" />
                  <span className="font-medium">{message.attachment.name}</span>
                  <span className="text-[10px] text-neutral-400">({message.attachment.size})</span>
                </div>
              )}

              {/* Agent Activity Trace (if assistant performed scanning/reasoning) */}
              {message.from === "assistant" && message.activityItems && message.activityItems.length > 0 && (
                <div className="w-full my-1">
                  <AgentActivity
                    status="complete"
                    duration={message.activityDuration ?? 3}
                    defaultOpen={false}
                    collapseOnComplete={true}
                    items={message.activityItems}
                  />
                </div>
              )}

              {/* Main message text with small grey BG for user, clean white/minimal for assistant */}
              {message.from === "user" ? (
                <div className="inline-block max-w-[85%] rounded-2xl border border-neutral-200/70 bg-neutral-100/90 px-4 py-2.5 text-sm leading-relaxed text-neutral-900 shadow-2xs">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              ) : message.isError ? (
                <div className="w-full rounded-2xl border border-rose-200/80 bg-rose-50/60 p-4 text-sm leading-relaxed text-rose-950 shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
                    <div className="space-y-1.5 whitespace-pre-wrap text-xs sm:text-sm">
                      {message.content}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full py-0.5 text-sm leading-relaxed text-neutral-900">
                  <StreamingResponse
                    status={message.streaming ? "streaming" : "complete"}
                    showActions={!message.streaming}
                    copyText={message.content}
                  >
                    <div className="space-y-3 whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </StreamingResponse>
                </div>
              )}

              {/* Knowledge Gap Diagnostic Card (only if provided and text/notes were given) */}
              {message.from === "assistant" && message.gapDiagnostic && (
                <GapAnalyzerCard data={message.gapDiagnostic} />
              )}

              {/* Revision Plan TodoList (only if provided) */}
              {message.from === "assistant" && message.revisionPlan && message.revisionPlan.length > 0 && (
                <div className="my-2 w-full">
                  <TodoList
                    title="7-Day High-Yield Revision Schedule"
                    items={message.revisionPlan}
                    defaultOpen={true}
                    collapseOnComplete={false}
                  />
                </div>
              )}
            </MessageContent>
          </Message>
        ))}

        {/* Pending Shimmer */}
        {pending && (
          <Message from="assistant" animateIn>
            <MessageAvatar className="size-8 rounded-full border border-neutral-200 bg-white shadow-2xs overflow-hidden">
              <img
                src="/logo.png"
                alt="ORVEXA"
                className="size-full object-contain p-0.5"
              />
            </MessageAvatar>
            <MessageContent>
              <MessageHeader className="text-xs text-neutral-400 font-medium">
                <span>ORVEXA</span>
                <span>Thinking</span>
              </MessageHeader>
              <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3">
                <ThinkingShimmer>
                  Scanning notes structure and detecting conceptual gaps…
                </ThinkingShimmer>
              </div>
            </MessageContent>
          </Message>
        )}
      </MessageGroup>
    </div>
  );
}
