"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Pin, MoreVertical, Copy, Archive, Trash2, Clock } from "lucide-react";
import { Note } from "../../types/note.types";
import { Badge } from "../shared/Badge";
import { cn } from "@/lib/utils";

interface NotesListProps {
  notes: Note[];
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const colorClasses: Record<Note["color"], string> = {
  default: "bg-slate-800/30 border-slate-700/50",
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

export function NotesList({
  notes,
  onSelect,
  onToggleFavorite,
  onTogglePin,
  onDuplicate,
  onArchive,
  onDelete,
}: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-lg">No notes found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notes.map((note, index) => (
        <NoteListItem
          key={note.id}
          note={note}
          index={index}
          onSelect={onSelect}
          onToggleFavorite={onToggleFavorite}
          onTogglePin={onTogglePin}
          onDuplicate={onDuplicate}
          onArchive={onArchive}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

interface NoteListItemProps {
  note: Note;
  index: number;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function NoteListItem({
  note,
  index,
  onSelect,
  onToggleFavorite,
  onTogglePin,
  onDuplicate,
  onArchive,
  onDelete,
}: NoteListItemProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="relative"
    >
      <div
        onClick={() => onSelect(note.id)}
        className={cn(
          "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:bg-slate-800/30",
          colorClasses[note.color],
          note.pinned && "border-amber-500/30"
        )}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {note.pinned && <Pin className="h-3 w-3 text-amber-400 fill-current" />}
              <h3 className="font-semibold text-white truncate">{note.title}</h3>
            </div>
            <p className="text-sm text-slate-300 line-clamp-2 mb-2">{note.preview}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {note.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="neutral" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600/50">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDate(note.updatedAt)}</span>
              </div>
              <span>•</span>
              <span>{note.readingTime} min read</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(note.id);
              }}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                note.pinned ? "text-amber-400" : "text-slate-500 hover:text-amber-400"
              )}
            >
              <Pin className={cn("h-4 w-4", note.pinned && "fill-current")} />
            </button>
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
        </div>
      </div>
    </motion.div>
  );
}
