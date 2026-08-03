"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Pin, Clock, FileText, Link2, Calendar, Edit } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Badge } from "../shared/Badge";
import { Note } from "../../types/note.types";
import { cn } from "@/lib/utils";

interface NotePreviewProps {
  note: Note | null;
  onClose: () => void;
  onEdit?: () => void;
  onToggleFavorite?: (id: string) => void;
  onTogglePin?: (id: string) => void;
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
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

export function NotePreview({
  note,
  onClose,
  onEdit,
  onToggleFavorite,
  onTogglePin,
}: NotePreviewProps) {
  if (!note) return null;

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
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] overflow-auto"
        >
          <PremiumCard className={cn("p-6 space-y-6", colorClasses[note.color])}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{note.title}</h2>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Updated {formatDate(note.updatedAt)}</span>
                  </div>
                  <span>•</span>
                  <span>{note.readingTime} min read</span>
                  <span>•</span>
                  <span>{note.wordCount} words</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onTogglePin && (
                  <button
                    onClick={() => onTogglePin(note.id)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      note.pinned ? "text-amber-400 bg-amber-500/10" : "text-slate-400 hover:text-amber-400"
                    )}
                  >
                    <Pin className={cn("h-5 w-5", note.pinned && "fill-current")} />
                  </button>
                )}
                {onToggleFavorite && (
                  <button
                    onClick={() => onToggleFavorite(note.id)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      note.favorite ? "text-pink-400 bg-pink-500/10" : "text-slate-400 hover:text-pink-400"
                    )}
                  >
                    <Star className={cn("h-5 w-5", note.favorite && "fill-current")} />
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <Badge key={tag} variant="neutral" className="bg-slate-700/50 text-slate-300 border-slate-600/50">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">{note.content}</div>
            </div>

            {(note.linkedGoals?.length || note.linkedTasks?.length || note.linkedDocuments?.length) && (
              <div className="pt-4 border-t border-slate-700/50">
                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Linked Items
                </h4>
                <div className="flex flex-wrap gap-2">
                  {note.linkedGoals?.map((goalId) => (
                    <Badge key={goalId} variant="neutral" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                      Goal
                    </Badge>
                  ))}
                  {note.linkedTasks?.map((taskId) => (
                    <Badge key={taskId} variant="neutral" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      Task
                    </Badge>
                  ))}
                  {note.linkedDocuments?.map((docId) => (
                    <Badge key={docId} variant="neutral" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                      Document
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Created {formatDate(note.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>Last viewed {formatDate(note.lastViewed)}</span>
              </div>
            </div>
          </PremiumCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
