"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Document } from "../../types/document.types";
import { DocumentCard } from "./DocumentCard";
import { ContentGrid } from "../layout/ContentGrid";

interface RecentDocumentsProps {
  documents: Document[];
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewAll?: () => void;
}

export function RecentDocuments({
  documents,
  onSelect,
  onToggleFavorite,
  onTogglePin,
  onDownload,
  onShare,
  onDelete,
  onViewAll,
}: RecentDocumentsProps) {
  const recentDocs = documents.slice(0, 6);

  if (recentDocs.length === 0) {
    return null;
  }

  return (
    <PremiumCard className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Recent Documents</h3>
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

      <ContentGrid columns={3} gap="md">
        {recentDocs.map((document, index) => (
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
    </PremiumCard>
  );
}
