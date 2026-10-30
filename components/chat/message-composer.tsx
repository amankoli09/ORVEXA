"use client";

import {
  ArrowUp,
  Plus,
  Paperclip,
  FileText,
  Calendar,
  X,
  Square,
  Sparkles,
  Check,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useRef,
  useState,
  useEffect,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  content?: string;
}

export interface MessageComposerProps {
  onSendMessage: (content: string, mode: string, attachment?: AttachedFile) => void;
  loading?: boolean;
  onStop?: () => void;
  disabled?: boolean;
  prefilledValue?: string;
}

const MODES = [
  {
    id: "gap-audit",
    label: "Gap Audit Mode",
    description: "Deep analysis of missing concepts and weak retention areas",
  },
  {
    id: "summary",
    label: "Quick Summary",
    description: "Concise recap of high-yield definitions and exam formulas",
  },
  {
    id: "revision-plan",
    label: "Revision Planner",
    description: "Spaced schedule tailored to exam topics and priorities",
  },
];

export function MessageComposer({
  onSendMessage,
  loading = false,
  onStop,
  disabled = false,
  prefilledValue = "",
}: MessageComposerProps) {
  const [input, setInput] = useState(prefilledValue);
  const [selectedMode, setSelectedMode] = useState("gap-audit");
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefilledValue) {
      setInput(prefilledValue);
      if (textareaRef.current) {
        textareaRef.current.focus();
        adjustHeight();
      }
    }
  }, [prefilledValue]);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, 44), 160);
    textarea.style.height = `${nextHeight}px`;
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustHeight();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if ((!trimmed && !attachedFile) || loading || disabled) return;

    onSendMessage(
      trimmed || (attachedFile ? `Analyzed file: ${attachedFile.name}` : ""),
      selectedMode,
      attachedFile ?? undefined,
    );

    setInput("");
    setAttachedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeText =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${sizeInKb} KB`;

    const isTextFile =
      file.type.startsWith("text/") ||
      /\.(txt|md|markdown|json|csv|py|js|ts|html|css|xml)$/i.test(file.name);

    if (isTextFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || "";
        setAttachedFile({
          id: Math.random().toString(36).substring(7),
          name: file.name,
          size: sizeText,
          type: file.type || "text/plain",
          content: text,
        });
      };
      reader.readAsText(file);
    } else {
      setAttachedFile({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: sizeText,
        type: file.type || "document",
      });
    }

    setPlusMenuOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
    setPlusMenuOpen(false);
  };

  const insertSyllabusTemplate = () => {
    const template = "Here is my exam syllabus and topics:\n1. [Topic 1]\n2. [Topic 2]\n\nPlease find my knowledge gaps and test me.";
    setInput(template);
    setPlusMenuOpen(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
      setTimeout(adjustHeight, 10);
    }
  };

  const canSubmit = (Boolean(input.trim()) || attachedFile !== null) && !disabled && !loading;
  const currentModeObj = MODES.find((m) => m.id === selectedMode) || MODES[0];

  return (
    <div className="w-full shrink-0 px-4 pt-2 pb-4 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.docx,.md,.doc"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Attached File Chip */}
        <AnimatePresence>
          {attachedFile && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="mb-2.5 inline-flex items-center gap-2 rounded-xl border border-neutral-200/90 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-800 shadow-2xs"
            >
              <div className="flex size-6 items-center justify-center rounded-lg bg-neutral-200/70 text-neutral-700">
                <FileText className="size-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="max-w-[200px] truncate font-medium sm:max-w-xs">
                  {attachedFile.name}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {attachedFile.size} · Ready for gap audit
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                aria-label="Remove attached file"
                className="ml-1 rounded-full p-1 text-neutral-400 hover:bg-neutral-200/60 hover:text-neutral-700"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rounded Main Input Box */}
        <div
          className={cn(
            "relative flex flex-col rounded-[22px] border border-black/[0.07] bg-white/90 p-1.5 shadow-[0_14px_44px_-20px_rgba(15,23,42,0.32)] backdrop-blur-xl transition-all duration-200 focus-within:border-black/[0.12] focus-within:shadow-[0_16px_48px_-18px_rgba(15,23,42,0.42)]",
            disabled && "opacity-60 pointer-events-none"
          )}
        >
          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your notes…"
            rows={1}
            disabled={disabled}
            className="w-full resize-none border-0 bg-transparent px-3.5 pt-2 pb-1 text-sm leading-relaxed text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
            style={{ maxHeight: "160px" }}
          />

          {/* Bottom Bar: Plus (+) button, Mode selector, and Send button */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="relative flex items-center gap-1.5">
              {/* Plus (+) Button */}
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Attach notes or actions"
                  onClick={() => {
                    setPlusMenuOpen(!plusMenuOpen);
                    setModeMenuOpen(false);
                  }}
                  className={cn(
                    "size-8 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                    plusMenuOpen && "bg-neutral-200 text-neutral-900"
                  )}
                >
                  <Plus className={cn("size-4 transition-transform duration-200", plusMenuOpen && "rotate-45")} />
                </Button>

                {/* Plus (+) Action Popover */}
                <AnimatePresence>
                  {plusMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setPlusMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-10 left-0 z-40 w-64 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg"
                      >
                        <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                          Study Attachments
                        </div>
                        <button
                          type="button"
                          onClick={triggerFileUpload}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-neutral-800 hover:bg-neutral-100 transition-colors"
                        >
                          <Paperclip className="size-4 text-neutral-500" />
                          <div>
                            <div>Upload Study Notes</div>
                            <span className="text-[10px] text-neutral-400 font-normal">PDF, TXT, DOCX files</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={insertSyllabusTemplate}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-neutral-800 hover:bg-neutral-100 transition-colors"
                        >
                          <FileText className="size-4 text-neutral-500" />
                          <div>
                            <div>Paste Syllabus Outline</div>
                            <span className="text-[10px] text-neutral-400 font-normal">Pre-filled study topic template</span>
                          </div>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Mode Selector Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setModeMenuOpen(!modeMenuOpen);
                    setPlusMenuOpen(false);
                  }}
                  className="flex h-7 items-center gap-1.5 rounded-full border border-neutral-200/80 bg-neutral-50 px-2.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <Sparkles className="size-3 text-neutral-500" />
                  <span>{currentModeObj.label}</span>
                  <ChevronDown className="size-3 text-neutral-400" />
                </button>

                {/* Mode Selector Menu */}
                <AnimatePresence>
                  {modeMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setModeMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-10 left-0 z-40 w-64 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg"
                      >
                        <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                          Analysis Mode
                        </div>
                        {MODES.map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => {
                              setSelectedMode(mode.id);
                              setModeMenuOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-start justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors",
                              selectedMode === mode.id
                                ? "bg-neutral-100 text-neutral-950 font-medium"
                                : "text-neutral-700 hover:bg-neutral-50"
                            )}
                          >
                            <div className="flex flex-col">
                              <span>{mode.label}</span>
                              <span className="text-[10px] text-neutral-400 font-normal">
                                {mode.description}
                              </span>
                            </div>
                            {selectedMode === mode.id && (
                              <Check className="size-3.5 mt-0.5 text-neutral-900 shrink-0" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Send / Stop Button */}
            <Button
              type={loading ? "button" : "submit"}
              size="icon"
              disabled={loading ? !onStop : !canSubmit}
              onClick={loading ? onStop : handleSubmit}
              aria-label={loading ? "Stop generating" : "Send message"}
              className={cn(
                "size-9 rounded-full transition-all duration-200",
                canSubmit || loading
                  ? "bg-neutral-950 text-white hover:bg-neutral-800"
                  : "bg-neutral-100 text-neutral-300"
              )}
            >
              {loading ? (
                <Square className="size-3 fill-current" />
              ) : (
                <ArrowUp className="size-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Minimal Footer Disclaimer */}
        <p className="mt-2 text-center text-[10.5px] text-neutral-400">
          AI can make mistakes. Verify critical material.
        </p>
      </div>
    </div>
  );
}

