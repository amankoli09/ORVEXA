import { ChatLayoutDynamic } from "@/components/chat/chat-layout-dynamic";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Dashboard — ORVEXA",
  description:
    "Conversational AI study assistant for diagnosing knowledge gaps and optimizing revision.",
};

export default function ChatPage() {
  return (
    <main className="h-screen w-full bg-white">
      <ChatLayoutDynamic />
    </main>
  );
}
