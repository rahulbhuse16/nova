"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Copy, ThumbsUp, ThumbsDown, Edit2, Trash2, RotateCcw, MoreVertical } from "lucide-react";
import { Message, MessageType } from "../../types/assistant.types";
import { AssistantAvatar } from "./AssistantAvatar";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  onAction?: (action: string) => void;
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const renderMessageContent = (message: Message) => {
  const content = message.content;

  if (message.type === "task") {
    return (
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-emerald-400">✅</span>
          <span className="font-semibold text-white">Task Created</span>
        </div>
        <p className="text-slate-200">{content}</p>
      </div>
    );
  }

  if (message.type === "goal") {
    return (
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-indigo-400">🎯</span>
          <span className="font-semibold text-white">Goal Set</span>
        </div>
        <p className="text-slate-200">{content}</p>
      </div>
    );
  }

  if (message.type === "calendar") {
    return (
      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-cyan-400">📅</span>
          <span className="font-semibold text-white">Event Scheduled</span>
        </div>
        <p className="text-slate-200">{content}</p>
      </div>
    );
  }

  if (message.type === "finance") {
    return (
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-amber-400">💰</span>
          <span className="font-semibold text-white">Financial Update</span>
        </div>
        <p className="text-slate-200">{content}</p>
      </div>
    );
  }

  if (message.type === "note") {
    return (
      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-purple-400">📝</span>
          <span className="font-semibold text-white">Note Created</span>
        </div>
        <p className="text-slate-200">{content}</p>
      </div>
    );
  }

  if (message.type === "document") {
    return (
      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-rose-400">📄</span>
          <span className="font-semibold text-white">Document</span>
        </div>
        <p className="text-slate-200">{content}</p>
      </div>
    );
  }

  if (message.type === "reminder") {
    return (
      <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-orange-400">⏰</span>
          <span className="font-semibold text-white">Reminder Set</span>
        </div>
        <p className="text-slate-200">{content}</p>
      </div>
    );
  }

  return (
    <div className="prose prose-invert max-w-none">
      <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">{content}</div>
    </div>
  );
};

export function MessageBubble({ message, onAction }: MessageBubbleProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const isUser = message.type === "user";
  const isSystem = message.type === "system";

  return (
    <div
      className={cn(
        "flex gap-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isUser && !isSystem && <AssistantAvatar />}

      <div className={cn("flex-1 max-w-3xl", isUser && "flex flex-col items-end")}>
        <div
          className={cn(
            "p-4 rounded-3xl",
            isUser
              ? "bg-indigo-500/20 border border-indigo-500/30"
              : "bg-slate-800/50 border border-slate-700/50"
          )}
        >
          {renderMessageContent(message)}

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="p-2 rounded-lg bg-slate-700/50 border border-slate-600/50 flex items-center gap-2"
                >
                  <span className="text-2xl">
                    {attachment.type === "image" && "🖼️"}
                    {attachment.type === "pdf" && "📕"}
                    {attachment.type === "word" && "📘"}
                    {attachment.type === "excel" && "📗"}
                    {attachment.type === "text" && "📄"}
                  </span>
                  <span className="text-sm text-slate-300">{attachment.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-slate-500">
            {formatTimestamp(message.timestamp)}
            {message.isEdited && " (edited)"}
          </span>

          {!isSystem && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onAction?.("copy")}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <Copy className="h-4 w-4" />
              </button>

              {!isUser && (
                <>
                  <button
                    onClick={() => onAction?.("like")}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      message.reaction === "like"
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-slate-500 hover:text-emerald-400"
                    )}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onAction?.("dislike")}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      message.reaction === "dislike"
                        ? "text-rose-400 bg-rose-500/10"
                        : "text-slate-500 hover:text-rose-400"
                    )}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </>
              )}

              <button
                onClick={() => onAction?.("edit")}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>

              {!isUser && (
                <button
                  onClick={() => onAction?.("regenerate")}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 top-8 w-36 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden z-10"
                  >
                    <button
                      onClick={() => {
                        onAction?.("delete");
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
