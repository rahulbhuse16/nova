"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Pin, MoreVertical, FileText, Download, Share2, Trash2 } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Badge } from "../shared/Badge";
import { Document } from "../../types/document.types";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  document: Document;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
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

const typeColors: Record<string, string> = {
  pdf: "bg-rose-500/20 text-rose-400 border-rose-500/20",
  image: "bg-purple-500/20 text-purple-400 border-purple-500/20",
  word: "bg-blue-500/20 text-blue-400 border-blue-500/20",
  excel: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  powerpoint: "bg-orange-500/20 text-orange-400 border-orange-500/20",
  note: "bg-amber-500/20 text-amber-400 border-amber-500/20",
  receipt: "bg-cyan-500/20 text-cyan-400 border-cyan-500/20",
  certificate: "bg-indigo-500/20 text-indigo-400 border-indigo-500/20",
  invoice: "bg-pink-500/20 text-pink-400 border-pink-500/20",
  contract: "bg-teal-500/20 text-teal-400 border-teal-500/20",
  other: "bg-slate-500/20 text-slate-400 border-slate-500/20",
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

export function DocumentCard({
  document,
  onSelect,
  onToggleFavorite,
  onTogglePin,
  onDownload,
  onShare,
  onDelete,
}: DocumentCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative"
    >
      <PremiumCard
        className={cn(
          "p-5 cursor-pointer transition-all duration-300",
          document.pinned && "border-indigo-500/30"
        )}
        onClick={() => onSelect(document.id)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-3xl">
              {document.thumbnail || typeIcons[document.type] || typeIcons.other}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-base truncate">{document.title}</h3>
              {document.description && (
                <p className="text-sm text-slate-400 mt-0.5 line-clamp-1">{document.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {document.pinned && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(document.id);
                }}
                className="p-2 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
              >
                <Pin className="h-4 w-4 fill-current" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(document.id);
              }}
              className={cn(
                "p-2 rounded-lg transition-colors",
                document.favorite ? "text-amber-400" : "text-slate-500 hover:text-amber-400"
              )}
            >
              <Star className={cn("h-4 w-4", document.favorite && "fill-current")} />
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 rounded-lg text-slate-500 hover:text-white transition-colors"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-10 w-48 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden z-10"
                >
                  {onDownload && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(document.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  )}
                  {onShare && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(document.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(document.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Badge variant="neutral" className={typeColors[document.type] || typeColors.other}>
            {document.type.toUpperCase()}
          </Badge>
          {document.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="neutral" className="bg-slate-700/50 text-slate-300 border-slate-600/50">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{formatBytes(document.size)}</span>
          <span>{formatDate(document.updatedAt)}</span>
        </div>

        {document.aiSummary && (
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <p className="text-xs text-slate-400 line-clamp-2">{document.aiSummary}</p>
          </div>
        )}
      </PremiumCard>
    </motion.div>
  );
}
