"use client";

import * as React from "react";
import { Clock, Pin, HardDrive, Lightbulb, Filter, Star } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Document } from "../../types/document.types";

interface DocumentSidebarProps {
  recentActivity: Document[];
  pinnedFiles: Document[];
  storageUsed: number;
  storageTotal: number;
  aiTip: string;
  onQuickFilter?: (filter: string) => void;
}

export function DocumentSidebar({
  recentActivity,
  pinnedFiles,
  storageUsed,
  storageTotal,
  aiTip,
  onQuickFilter,
}: DocumentSidebarProps) {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const storagePercentage = Math.round((storageUsed / storageTotal) * 100);

  return (
    <div className="space-y-4 sticky top-6">
      <PremiumCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="space-y-2">
          {recentActivity.slice(0, 4).map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <p className="text-sm font-medium text-white truncate">{doc.title}</p>
              <p className="text-xs text-slate-400 mt-1">{doc.updatedAt}</p>
            </div>
          ))}
        </div>
      </PremiumCard>

      <PremiumCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Pin className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Pinned Files</h3>
        </div>
        <div className="space-y-2">
          {pinnedFiles.slice(0, 4).map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              <p className="text-sm font-medium text-white truncate">{doc.title}</p>
              <p className="text-xs text-slate-400 mt-1">{formatBytes(doc.size)}</p>
            </div>
          ))}
          {pinnedFiles.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-2">No pinned files</p>
          )}
        </div>
      </PremiumCard>

      <PremiumCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Storage</h3>
        </div>
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Used</span>
            <span className="text-sm font-semibold text-white">{storagePercentage}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">{formatBytes(storageUsed)} of {formatBytes(storageTotal)}</p>
        </div>
      </PremiumCard>

      <PremiumCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">AI Tip</h3>
        </div>
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-sm text-indigo-200">{aiTip}</p>
        </div>
      </PremiumCard>

      <PremiumCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Quick Filters</h3>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => onQuickFilter?.("favorites")}
            className="w-full p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/50 transition-colors flex items-center gap-2"
          >
            <Star className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-white">Favorites</span>
          </button>
          <button
            onClick={() => onQuickFilter?.("pinned")}
            className="w-full p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/50 transition-colors flex items-center gap-2"
          >
            <Pin className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-white">Pinned</span>
          </button>
          <button
            onClick={() => onQuickFilter?.("recent")}
            className="w-full p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/50 transition-colors flex items-center gap-2"
          >
            <Clock className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-white">Recent</span>
          </button>
        </div>
      </PremiumCard>
    </div>
  );
}
