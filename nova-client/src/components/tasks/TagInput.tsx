"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestedTags?: string[];
}

export function TagInput({ tags, onTagsChange, suggestedTags = ["Office", "Design", "Client", "Health", "Urgent", "Review"] }: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      onTagsChange([...tags, tag.trim()]);
    }
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center gap-2">
        <Tag className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Tags</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:bg-indigo-500/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Add a tag..."
        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
      />

      {suggestedTags.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 mb-2">Suggested tags</p>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => addTag(tag)}
                disabled={tags.includes(tag)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  tags.includes(tag)
                    ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                    : "bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-400"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </PremiumCard>
  );
}
