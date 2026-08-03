"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Document } from "../../types/document.types";
import { DocumentCard } from "./DocumentCard";
import { ContentGrid } from "../layout/ContentGrid";

interface DocumentGridProps {
  documents: Document[];
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function DocumentGrid({
  documents,
  onSelect,
  onToggleFavorite,
  onTogglePin,
  onDownload,
  onShare,
  onDelete,
}: DocumentGridProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-lg">No documents found</p>
      </div>
    );
  }

  return (
    <ContentGrid columns={3} gap="lg">
      {documents.map((document, index) => (
        <motion.div
          key={document.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <DocumentCard
            document={document}
            onSelect={onSelect}
            onToggleFavorite={onToggleFavorite}
            onTogglePin={onTogglePin}
            onDownload={onDownload}
            onShare={onShare}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </ContentGrid>
  );
}
