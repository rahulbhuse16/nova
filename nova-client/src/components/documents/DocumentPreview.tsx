"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { X, Download, Share2, Star, Pin, FileText, Calendar, User, HardDrive } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Badge } from "../shared/Badge";
import { Document } from "../../types/document.types";
import { cn } from "@/lib/utils";

interface DocumentPreviewProps {
  document: Document | null;
  onClose: () => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

const typeIcons: Record<string, string> = {
  pdf: "📄",
  image: "🖼️",
  word: "📝",
  excel: "📊",
  powerpoint: "📽️",
  note: "📒",
  receipt: "🧾",
  certificate: "🎓",
  invoice: "💳",
  contract: "📋",
  other: "📁",
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

export function DocumentPreview({
  document,
  onClose,
  onDownload,
  onShare,
  onToggleFavorite,
  onTogglePin,
}: DocumentPreviewProps) {
  if (!document) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-auto"
      >
        <PremiumCard className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-4xl">
                {document.thumbnail || typeIcons[document.type] || typeIcons.other}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{document.title}</h2>
                {document.description && (
                  <p className="text-slate-400 mt-1">{document.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral" className="bg-indigo-500/20 text-indigo-400 border-indigo-500/20">
              {document.type.toUpperCase()}
            </Badge>
            <Badge variant="neutral" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20">
              {document.category.toUpperCase()}
            </Badge>
            {document.tags.map((tag) => (
              <Badge key={tag} variant="neutral" className="bg-slate-700/50 text-slate-300 border-slate-600/50">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <HardDrive className="h-4 w-4" />
                Size
              </div>
              <p className="text-lg font-semibold text-white">{formatBytes(document.size)}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Calendar className="h-4 w-4" />
                Created
              </div>
              <p className="text-lg font-semibold text-white">{document.createdAt}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <FileText className="h-4 w-4" />
                Pages
              </div>
              <p className="text-lg font-semibold text-white">{document.pages || "N/A"}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <User className="h-4 w-4" />
                Author
              </div>
              <p className="text-lg font-semibold text-white">{document.author || "N/A"}</p>
            </div>
          </div>

          {document.aiSummary && (
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <h3 className="text-sm font-semibold text-indigo-300 mb-2">AI Summary</h3>
              <p className="text-slate-300">{document.aiSummary}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700/50">
            {onDownload && (
              <button
                onClick={() => onDownload(document.id)}
                className="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/30 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            )}
            {onShare && (
              <button
                onClick={() => onShare(document.id)}
                className="px-4 py-2 rounded-xl bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50 transition-colors flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            )}
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(document.id)}
                className={cn(
                  "px-4 py-2 rounded-xl border transition-colors flex items-center gap-2",
                  document.favorite
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/20 hover:bg-amber-500/30"
                    : "bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-700/50"
                )}
              >
                <Star className={cn("h-4 w-4", document.favorite && "fill-current")} />
                {document.favorite ? "Favorited" : "Favorite"}
              </button>
            )}
            {onTogglePin && (
              <button
                onClick={() => onTogglePin(document.id)}
                className={cn(
                  "px-4 py-2 rounded-xl border transition-colors flex items-center gap-2",
                  document.pinned
                    ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/30"
                    : "bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-700/50"
                )}
              >
                <Pin className={cn("h-4 w-4", document.pinned && "fill-current")} />
                {document.pinned ? "Pinned" : "Pin"}
              </button>
            )}
          </div>
        </PremiumCard>
      </motion.div>
    </motion.div>
  );
}
