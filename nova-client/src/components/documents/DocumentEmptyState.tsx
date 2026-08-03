"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Sparkles } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { PrimaryButton } from "../buttons/PrimaryButton";

interface DocumentEmptyStateProps {
  onUpload?: () => void;
  onCreateFolder?: () => void;
  message?: string;
}

export function DocumentEmptyState({
  onUpload,
  onCreateFolder,
  message = "No documents yet",
}: DocumentEmptyStateProps) {
  return (
    <PremiumCard className="p-12 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <FileText className="h-10 w-10 text-indigo-400" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{message}</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Start building your personal knowledge hub by uploading your first document. Nova will help you organize and find everything.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <PrimaryButton
            icon={<Upload className="h-4 w-4" />}
            onClick={onUpload}
          >
            Upload Document
          </PrimaryButton>
          <PrimaryButton
            icon={<Sparkles className="h-4 w-4" />}
            variant="glass"
          >
            AI Document Scanner
          </PrimaryButton>
        </div>

        <div className="pt-6 border-t border-slate-700/50">
          <p className="text-xs text-slate-500">
            💡 Tip: Upload PDFs, images, and documents for AI-powered organization
          </p>
        </div>
      </motion.div>
    </PremiumCard>
  );
}
