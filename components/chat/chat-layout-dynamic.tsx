"use client";

import dynamic from "next/dynamic";

// ssr: false must live inside a Client Component (Next.js 16 restriction)
const ChatLayout = dynamic(
  () => import("@/components/chat/chat-layout").then((m) => m.ChatLayout),
  { ssr: false }
);

export function ChatLayoutDynamic() {
  return <ChatLayout />;
}
