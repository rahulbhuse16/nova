"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mic, Image, CheckSquare, Sparkles } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { cn } from "@/lib/utils";

interface QuickCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (content: string, type: "text" | "checklist" | "voice" | "image") => void;
}

export function QuickCapture({ isOpen, onClose, onCapture }: QuickCaptureProps) {
  const [content, setContent] = React.useState("");
  const [captureType, setCaptureType] = React.useState<"text" | "checklist" | "voice" | "image">("text");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleCapture = () => {
    if (content.trim()) {
      onCapture(content, captureType);
      setContent("");
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleCapture();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl"
        >
          <PremiumCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">Quick Capture</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setCaptureType("text")}
                className={cn(
                  "flex-1 p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all",
                  captureType === "text"
                    ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                    : "bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600/50"
                )}
              >
                <Send className="h-4 w-4" />
                <span className="text-sm font-medium">Text</span>
              </button>
              <button
                onClick={() => setCaptureType("checklist")}
                className={cn(
                  "flex-1 p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all",
                  captureType === "checklist"
                    ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                    : "bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600/50"
                )}
              >
                <CheckSquare className="h-4 w-4" />
                <span className="text-sm font-medium">Checklist</span>
              </button>
              <button
                onClick={() => setCaptureType("voice")}
                className={cn(
                  "flex-1 p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all",
                  captureType === "voice"
                    ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                    : "bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600/50"
                )}
              >
                <Mic className="h-4 w-4" />
                <span className="text-sm font-medium">Voice</span>
              </button>
              <button
                onClick={() => setCaptureType("image")}
                className={cn(
                  "flex-1 p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all",
                  captureType === "image"
                    ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                    : "bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600/50"
                )}
              >
                <Image className="h-4 w-4" />
                <span className="text-sm font-medium">Image</span>
              </button>
            </div>

            {captureType === "text" || captureType === "checklist" ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={captureType === "text" ? "Capture your thought..." : "Create a checklist..."}
                className="w-full h-40 p-4 rounded-xl bg-slate-800/50 border-2 border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
              />
            ) : captureType === "voice" ? (
              <div className="p-8 rounded-xl bg-slate-800/50 border-2 border-slate-700/50 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center mb-4 animate-pulse">
                  <Mic className="h-8 w-8 text-indigo-400" />
                </div>
                <p className="text-slate-400">Tap to start recording...</p>
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-slate-800/50 border-2 border-slate-700/50 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center mb-4">
                  <Image className="h-8 w-8 text-indigo-400" />
                </div>
                <p className="text-slate-400">Tap to capture image...</p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">
                {captureType === "text" ? "⌘ + Enter to capture" : "AI-powered capture"}
              </p>
              <PrimaryButton icon={<Send className="h-4 w-4" />} onClick={handleCapture}>
                Capture
              </PrimaryButton>
            </div>
          </PremiumCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
