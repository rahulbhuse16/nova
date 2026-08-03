"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { X, FileText, Image as ImageIcon, File, Download } from "lucide-react";
import { Attachment } from "../../types/assistant.types";
import { cn } from "@/lib/utils";

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemove: () => void;
  onDownload?: () => void;
}

const typeIcons: Record<Attachment["type"], React.ReactNode> = {
  image: <ImageIcon className="h-5 w-5" />,
  pdf: <FileText className="h-5 w-5" />,
  word: <FileText className="h-5 w-5" />,
  excel: <FileText className="h-5 w-5" />,
  text: <FileText className="h-5 w-5" />,
};

const typeColors: Record<Attachment["type"], string> = {
  image: "bg-purple-500/20 border-purple-500/30 text-purple-300",
  pdf: "bg-red-500/20 border-red-500/30 text-red-300",
  word: "bg-blue-500/20 border-blue-500/30 text-blue-300",
  excel: "bg-green-500/20 border-green-500/30 text-green-300",
  text: "bg-slate-500/20 border-slate-500/30 text-slate-300",
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export function AttachmentPreview({ attachment, onRemove, onDownload }: AttachmentPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "p-3 rounded-xl border-2 flex items-center gap-3",
        typeColors[attachment.type]
      )}
    >
      <div className="flex-shrink-0 p-2 rounded-lg bg-slate-900/50">
        {typeIcons[attachment.type]}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{attachment.name}</p>
        <p className="text-xs text-slate-300">{formatFileSize(attachment.size)}</p>
      </div>

      <div className="flex items-center gap-1">
        {onDownload && (
          <button
            onClick={onDownload}
            className="p-2 rounded-lg hover:bg-slate-900/50 transition-colors"
          >
            <Download className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={onRemove}
          className="p-2 rounded-lg hover:bg-slate-900/50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
