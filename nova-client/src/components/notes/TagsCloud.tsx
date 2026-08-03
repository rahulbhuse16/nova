"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Hash } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";

interface TagsCloudProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

const tagColors: Record<string, string> = {
  nova: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  architecture: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  business: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  startup: "bg-green-500/20 text-green-300 border-green-500/30",
  ideas: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  planning: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  weekly: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  productivity: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  meeting: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  design: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  team: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  react: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  programming: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "best-practices": "bg-teal-500/20 text-teal-300 border-teal-500/30",
  learning: "bg-green-500/20 text-green-300 border-green-500/30",
  roadmap: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  growth: "bg-lime-500/20 text-lime-300 border-lime-500/30",
  travel: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  checklist: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  europe: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  books: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  reading: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  ai: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  innovation: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
  finance: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  budget: "bg-green-500/20 text-green-300 border-green-500/30",
};

export function TagsCloud({ tags, onTagClick }: TagsCloudProps) {
  if (tags.length === 0) {
    return null;
  }

  const getTagColor = (tag: string): string => {
    return tagColors[tag] || "bg-slate-500/20 text-slate-300 border-slate-500/30";
  };

  return (
    <PremiumCard className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Hash className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Tags</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <motion.button
            key={tag}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => onTagClick?.(tag)}
            className={cn(
              "px-3 py-1.5 rounded-full border text-sm font-medium transition-all hover:scale-105",
              getTagColor(tag)
            )}
          >
            #{tag}
          </motion.button>
        ))}
      </div>
    </PremiumCard>
  );
}

import { cn } from "@/lib/utils";
