"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Filter, X, Grid3x3, List, SortAsc } from "lucide-react";
import { NoteFolder, NoteColor, SortBy } from "../../types/note.types";
import { cn } from "@/lib/utils";

interface NotesFiltersProps {
  selectedFolder: NoteFolder;
  onFolderChange: (folder: NoteFolder) => void;
  selectedColor: NoteColor | "all";
  onColorChange: (color: NoteColor | "all") => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

const folders: Array<{ id: NoteFolder; name: string; icon: string }> = [
  { id: "all", name: "All Notes", icon: "📝" },
  { id: "personal", name: "Personal", icon: "👤" },
  { id: "work", name: "Work", icon: "💼" },
  { id: "ideas", name: "Ideas", icon: "💡" },
  { id: "learning", name: "Learning", icon: "📚" },
  { id: "projects", name: "Projects", icon: "🚀" },
  { id: "journal", name: "Journal", icon: "📔" },
  { id: "travel", name: "Travel", icon: "✈️" },
  { id: "finance", name: "Finance", icon: "💰" },
  { id: "health", name: "Health", icon: "❤️" },
  { id: "documents", name: "Documents", icon: "📄" },
];

const colors: Array<{ id: NoteColor | "all"; name: string; color: string }> = [
  { id: "all", name: "All Colors", color: "bg-slate-500" },
  { id: "default", name: "Default", color: "bg-slate-400" },
  { id: "blue", name: "Blue", color: "bg-blue-400" },
  { id: "green", name: "Green", color: "bg-green-400" },
  { id: "yellow", name: "Yellow", color: "bg-yellow-400" },
  { id: "red", name: "Red", color: "bg-red-400" },
  { id: "purple", name: "Purple", color: "bg-purple-400" },
  { id: "pink", name: "Pink", color: "bg-pink-400" },
  { id: "orange", name: "Orange", color: "bg-orange-400" },
];

const sortOptions: Array<{ id: SortBy; name: string }> = [
  { id: "updated", name: "Recently Updated" },
  { id: "created", name: "Recently Created" },
  { id: "title", name: "Title A-Z" },
  { id: "date", name: "Date" },
];

export function NotesFilters({
  selectedFolder,
  onFolderChange,
  selectedColor,
  onColorChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
  hasActiveFilters,
}: NotesFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">Filters</span>
        </div>
        {hasActiveFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Folder:</span>
          <select
            value={selectedFolder}
            onChange={(e) => onFolderChange(e.target.value as NoteFolder)}
            className="px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
          >
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.icon} {folder.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Color:</span>
          <select
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value as NoteColor | "all")}
            className="px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
          >
            {colors.map((color) => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            className="px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === "grid"
                ? "bg-indigo-500/20 text-indigo-400"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            )}
          >
            <Grid3x3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === "list"
                ? "bg-indigo-500/20 text-indigo-400"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            )}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
