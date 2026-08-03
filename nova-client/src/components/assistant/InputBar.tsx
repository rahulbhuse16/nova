"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, X, Command } from "lucide-react";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { cn } from "@/lib/utils";

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onAttach?: () => void;
  attachments?: Array<{ id: string; name: string; type: string }>;
  onRemoveAttachment?: (id: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const slashCommands = [
  { command: "/task", label: "Create Task", icon: "✅" },
  { command: "/note", label: "Create Note", icon: "📝" },
  { command: "/calendar", label: "Schedule Event", icon: "📅" },
  { command: "/reminder", label: "Set Reminder", icon: "⏰" },
  { command: "/goal", label: "Set Goal", icon: "🎯" },
  { command: "/document", label: "Create Document", icon: "📄" },
  { command: "/finance", label: "Add Expense", icon: "💰" },
  { command: "/journal", label: "Journal Entry", icon: "📔" },
  { command: "/health", label: "Log Health", icon: "❤️" },
];

export function InputBar({
  value,
  onChange,
  onSend,
  onAttach,
  attachments = [],
  onRemoveAttachment,
  disabled = false,
  placeholder = "Ask Nova anything...",
}: InputBarProps) {
  const [showCommands, setShowCommands] = React.useState(false);
  const [filteredCommands, setFilteredCommands] = React.useState(slashCommands);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (newValue.startsWith("/")) {
      const filtered = slashCommands.filter((cmd) =>
        cmd.command.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredCommands(filtered);
      setShowCommands(filtered.length > 0);
    } else {
      setShowCommands(false);
    }
  };

  const handleCommandSelect = (command: string) => {
    onChange(command + " ");
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  };

  React.useEffect(() => {
    autoResize();
  }, [value]);

  return (
    <div className="space-y-3">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50"
            >
              <span className="text-lg">
                {attachment.type === "image" && "🖼️"}
                {attachment.type === "pdf" && "📕"}
                {attachment.type === "word" && "📘"}
                {attachment.type === "excel" && "📗"}
                {attachment.type === "text" && "📄"}
              </span>
              <span className="text-sm text-slate-300 truncate max-w-[150px]">{attachment.name}</span>
              <button
                onClick={() => onRemoveAttachment?.(attachment.id)}
                className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="flex items-end gap-3 p-4 rounded-3xl bg-slate-800/50 border-2 border-slate-700/50 focus-within:border-indigo-500/50 transition-colors">
          <button
            onClick={onAttach}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:outline-none resize-none min-h-[44px] max-h-[200px]"
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              {value.length > 0 && `${value.length} chars`}
            </span>
            <PrimaryButton
              icon={<Send className="h-4 w-4" />}
              onClick={onSend}
              disabled={!value.trim() || disabled}
              className="h-10 px-4"
            >
              Send
            </PrimaryButton>
          </div>
        </div>

        <AnimatePresence>
          {showCommands && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl z-10"
            >
              {filteredCommands.map((cmd) => (
                <button
                  key={cmd.command}
                  onClick={() => handleCommandSelect(cmd.command)}
                  className="w-full p-3 flex items-center gap-3 rounded-xl hover:bg-slate-700/50 transition-colors"
                >
                  <span className="text-xl">{cmd.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">{cmd.label}</div>
                    <div className="text-xs text-slate-400">{cmd.command}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Command className="h-3 w-3" />
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
        <span>Press Enter to send</span>
        <span>•</span>
        <span>Shift + Enter for new line</span>
        <span>•</span>
        <span>Use / for commands</span>
      </div>
    </div>
  );
}
