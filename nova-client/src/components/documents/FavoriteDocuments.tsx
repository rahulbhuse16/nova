"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Pin, ArrowRight } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Document } from "../../types/document.types";
import { cn } from "@/lib/utils";

interface FavoriteDocumentsProps {
  favorites: Document[];
  pinned: Document[];
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  onViewAll?: () => void;
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

export function FavoriteDocuments({
  favorites,
  pinned,
  onSelect,
  onToggleFavorite,
  onTogglePin,
  onViewAll,
}: FavoriteDocumentsProps) {
  return (
    <PremiumCard className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Favorites & Pinned</h3>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {pinned.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Pin className="h-3 w-3 text-indigo-400" />
              Pinned
            </p>
            {pinned.slice(0, 3).map((doc) => (
              <FavoriteItem
                key={doc.id}
                document={doc}
                onSelect={onSelect}
                onToggleFavorite={onToggleFavorite}
                onTogglePin={onTogglePin}
              />
            ))}
          </div>
        )}

        {favorites.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Star className="h-3 w-3 text-amber-400" />
              Favorites
            </p>
            {favorites.filter((f) => !f.pinned).slice(0, 3).map((doc) => (
              <FavoriteItem
                key={doc.id}
                document={doc}
                onSelect={onSelect}
                onToggleFavorite={onToggleFavorite}
                onTogglePin={onTogglePin}
              />
            ))}
          </div>
        )}

        {favorites.length === 0 && pinned.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No favorites or pinned documents yet</p>
          </div>
        )}
      </div>
    </PremiumCard>
  );
}

interface FavoriteItemProps {
  document: Document;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
}

function FavoriteItem({ document, onSelect, onToggleFavorite, onTogglePin }: FavoriteItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => onSelect(document.id)}
      className={cn(
        "p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:bg-slate-800/30",
        document.pinned ? "border-indigo-500/30 bg-indigo-500/5" : "border-slate-700/50 bg-slate-800/20"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-xl flex-shrink-0">
          {document.thumbnail || typeIcons[document.type] || typeIcons.other}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {document.pinned && <Pin className="h-3 w-3 text-indigo-400 fill-current" />}
            <h4 className="font-medium text-white truncate">{document.title}</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{formatBytes(document.size)}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(document.id);
            }}
            className={cn(
              "p-1.5 rounded transition-colors",
              document.pinned ? "text-indigo-400" : "text-slate-500 hover:text-indigo-400"
            )}
          >
            <Pin className={cn("h-3.5 w-3.5", document.pinned && "fill-current")} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(document.id);
            }}
            className={cn(
              "p-1.5 rounded transition-colors",
              document.favorite ? "text-amber-400" : "text-slate-500 hover:text-amber-400"
            )}
          >
            <Star className={cn("h-3.5 w-3.5", document.favorite && "fill-current")} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
