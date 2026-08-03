"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Link2, Target, FileText, CheckSquare, ArrowRight } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Note } from "../../types/note.types";
import { cn } from "@/lib/utils";

interface RelatedNotesProps {
  relatedNotes: Note[];
  relatedGoals?: Array<{ id: string; title: string }>;
  relatedTasks?: Array<{ id: string; title: string }>;
  relatedDocuments?: Array<{ id: string; title: string }>;
  onNoteClick?: (id: string) => void;
}

export function RelatedNotes({
  relatedNotes,
  relatedGoals = [],
  relatedTasks = [],
  relatedDocuments = [],
  onNoteClick,
}: RelatedNotesProps) {
  const hasRelatedItems =
    relatedNotes.length > 0 ||
    relatedGoals.length > 0 ||
    relatedTasks.length > 0 ||
    relatedDocuments.length > 0;

  if (!hasRelatedItems) {
    return null;
  }

  return (
    <PremiumCard className="p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Link2 className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Knowledge Connections</h3>
      </div>

      <div className="space-y-4">
        {relatedNotes.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Related Notes</p>
            <div className="space-y-2">
              {relatedNotes.slice(0, 3).map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onNoteClick?.(note.id)}
                  className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/50 cursor-pointer transition-colors"
                >
                  <p className="text-sm font-medium text-white truncate">{note.title}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{note.preview}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {relatedGoals.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Related Goals</p>
            <div className="space-y-2">
              {relatedGoals.slice(0, 3).map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-400" />
                    <p className="text-sm font-medium text-white truncate">{goal.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {relatedTasks.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Related Tasks</p>
            <div className="space-y-2">
              {relatedTasks.slice(0, 3).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-emerald-400" />
                    <p className="text-sm font-medium text-white truncate">{task.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {relatedDocuments.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Related Documents</p>
            <div className="space-y-2">
              {relatedDocuments.slice(0, 3).map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    <p className="text-sm font-medium text-white truncate">{doc.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="w-full p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors flex items-center justify-center gap-2">
        <span>View All Connections</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </PremiumCard>
  );
}
