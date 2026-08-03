"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Pin, MoreVertical, Copy, Archive, Trash2, Clock } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Badge } from "../shared/Badge";
import { Note } from "../../types/note.types";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const colorClasses: Record<Note["color"], string> = {
  default: "bg-slate-800/50 border-slate-700/50",
  blue: "bg-blue-500/10 border-blue-500/20",
  green: "bg-green-500/10 border-green-500/20",
  yellow: "bg-yellow-500/10 border-yellow-500/20",
  red: "bg-red-500/10 border-red-500/20",
  purple: "bg-purple-500/10 border-purple-500/20",
  pink: "bg-pink-500/10 border-pink-500/20",
  orange: "bg-orange-500/10 border-orange-500/20",
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

export function NoteCard({
  note,
  onSelect,
  onToggleFavorite,
  onTogglePin,
  onDuplicate,
  onArchive,
  onDelete,
}: NoteCardProps) {
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
          "p-5 cursor-pointer transition-all duration-300 min-h-[200px]",
          colorClasses[note.color],
          note.pinned && "border-amber-500/30"
        )}
        onClick={() => onSelect(note.id)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {note.pinned && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note.id);
                }}
                className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors"
              >
                <Pin className="h-4 w-4 fill-current" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(note.id);
              }}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                note.favorite ? "text-pink-400" : "text-slate-500 hover:text-pink-400"
              )}
            >
              <Star className={cn("h-4 w-4", note.favorite && "fill-current")} />
            </button>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-8 w-44 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden z-10"
              >
                {onDuplicate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate(note.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate
                  </button>
                )}
                {onArchive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive(note.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors"
                  >
                    <Archive className="h-4 w-4" />
                    Archive
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(note.id);
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

        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{note.title}</h3>
        <p className="text-sm text-slate-300 mb-3 line-clamp-3 flex-1">{note.preview}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {note.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="neutral" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600/50">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(note.updatedAt)}</span>
          </div>
          <span>{note.readingTime} min read</span>
        </div>
      </PremiumCard>
    </motion.div>
  );
}
