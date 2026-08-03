"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Folder } from "lucide-react";
import { Folder as FolderType } from "../../types/document.types";
import { PremiumCard } from "../cards/PremiumCard";

interface DocumentCategoriesProps {
  folders: FolderType[];
  onFolderClick?: (folderId: string) => void;
}

export function DocumentCategories({ folders, onFolderClick }: DocumentCategoriesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {folders.map((folder, index) => (
        <motion.div
          key={folder.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onFolderClick?.(folder.id)}
        >
          <PremiumCard className="p-6 cursor-pointer hover:border-indigo-500/30 transition-all duration-200">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4", folder.color)}>
              {folder.icon}
            </div>
            <h3 className="font-semibold text-white text-base">{folder.name}</h3>
            <p className="text-sm text-slate-400 mt-1">{folder.documentCount} documents</p>
          </PremiumCard>
        </motion.div>
      ))}
    </div>
  );
}

import { cn } from "@/lib/utils";
