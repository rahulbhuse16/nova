"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Note } from "../../types/note.types";
import { NoteCard } from "./NoteCard";
import { ContentGrid } from "../layout/ContentGrid";

interface RecentNotesProps {
  recentNotes: Note[];
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewAll?: () => void;
}

export function RecentNotes({
  recentNotes,
  onSelect,
  onToggleFavorite,
  onTogglePin,
  onDuplicate,
  onArchive,
  onDelete,
  onViewAll,
}: RecentNotesProps) {
  if (recentNotes.length === 0) {
    return null;
  }

  return (
    <PremiumCard className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Recent Notes</h3>
        </div>
        {onViewAll && recentNotes.length > 6 && (
          <button
            onClick={onViewAll}
            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <ContentGrid columns={3} gap="md">
        {recentNotes.slice(0, 6).map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <NoteCard
              note={note}
              onSelect={onSelect}
              onToggleFavorite={onToggleFavorite}
              onTogglePin={onTogglePin}
              onDuplicate={onDuplicate}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </ContentGrid>
    </PremiumCard>
  );
}
