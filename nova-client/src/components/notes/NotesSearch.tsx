"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotesSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  recentSearches: string[];
  suggestedFilters: string[];
  onRecentSearchClick?: (search: string) => void;
  onSuggestedFilterClick?: (filter: string) => void;
}

export function NotesSearch({
  search,
  onSearchChange,
  recentSearches,
  suggestedFilters,
  onRecentSearchClick,
  onSuggestedFilterClick,
}: NotesSearchProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search notes by title, content, or tags..."
          className={cn(
            "w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-800/50 border-2 text-white placeholder-slate-500 focus:outline-none transition-all duration-200",
            isFocused ? "border-indigo-500/50" : "border-slate-700/50"
          )}
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isFocused && !search && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          {recentSearches.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Recent Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <button
                    key={item}
                    onClick={() => onRecentSearchClick?.(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestedFilters.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                Suggested Filters
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => onSuggestedFilterClick?.(filter)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-300 hover:bg-indigo-500/20 transition-colors"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
