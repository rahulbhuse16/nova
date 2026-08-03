"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Note } from "../../types/note.types";
import { NoteCard } from "./NoteCard";
import { ContentGrid } from "../layout/ContentGrid";

interface NotesGridProps {
  notes: Note[];
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function NotesGrid({
  notes,
  onSelect,
  onToggleFavorite,
  onTogglePin,
  onDuplicate,
  onArchive,
  onDelete,
}: NotesGridProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-lg">No notes found</p>
      </div>
    );
  }

  return (
    <ContentGrid columns={3} gap="lg">
      {notes.map((note, index) => (
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
  );
}
