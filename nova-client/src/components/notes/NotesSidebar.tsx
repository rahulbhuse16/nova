"use client";

import * as React from "react";
import { Clock, Pin, Star, Lightbulb, Flame, Filter } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Note } from "../../types/note.types";

interface NotesSidebarProps {
  todayNotes: Note[];
  recentlyEdited: Note[];
  pinnedNotes: Note[];
  writingStreak: number;
  aiTip: string;
  onQuickFilter?: (filter: string) => void;
}

export function NotesSidebar({
  todayNotes,
  recentlyEdited,
  pinnedNotes,
  writingStreak,
  aiTip,
  onQuickFilter,
}: NotesSidebarProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4 sticky top-6">
      <PremiumCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Today's Notes</h3>
        </div>
        <div className="space-y-2">
          {todayNotes.slice(0, 4).map((note) => (
            <div
              key={note.id}
              className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <p className="text-sm font-medium text-white truncate">{note.title}</p>
              <p className="text-xs text-slate-400 mt-1">{formatDate(note.updatedAt)}</p>
            </div>
          ))}
          {todayNotes.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-2">No notes today</p>
          )}
        </div>
      </PremiumCard>

      <PremiumCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Recently Edited</h3>
        </div>
        <div className="space-y-2">
          {recentlyEdited.slice(0, 4).map((note) => (
            <div
              key={note.id}
              className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors cursor-pointer"
            >
              <p className="text-sm font-medium text-white truncate">{note.title}</p>
              <p className="text-xs text-slate-400 mt-1">{formatDate(note.updatedAt)}</p>
            </div>
          ))}
        </div>
      </PremiumCard>

      <PremiumCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Pin className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Pinned</h3>
        </div>
        <div className="space-y-2">
          {pinnedNotes.slice(0, 4).map((note) => (
            <div
              key={note.id}
              className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              <p className="text-sm font-medium text-white truncate">{note.title}</p>
              <p className="text-xs text-slate-400 mt-1">{note.readingTime} min read</p>
            </div>
          ))}
          {pinnedNotes.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-2">No pinned notes</p>
          )}
        </div>
      </PremiumCard>

      <PremiumCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Writing Streak</h3>
        </div>
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <p className="text-3xl font-bold text-orange-400">{writingStreak}</p>
          <p className="text-sm text-slate-300 mt-1">days in a row</p>
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
            <Star className="h-4 w-4 text-pink-400" />
            <span className="text-sm text-white">Favorites</span>
          </button>
          <button
            onClick={() => onQuickFilter?.("pinned")}
            className="w-full p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/50 transition-colors flex items-center gap-2"
          >
            <Pin className="h-4 w-4 text-amber-400" />
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
