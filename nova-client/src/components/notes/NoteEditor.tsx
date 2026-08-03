"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Star, Pin, Hash, Folder, Palette } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { Note, NoteFolder, NoteColor } from "../../types/note.types";
import { cn } from "@/lib/utils";

interface NoteEditorProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
}

const colorOptions: Array<{ id: NoteColor; color: string; name: string }> = [
  { id: "default", color: "bg-slate-500", name: "Default" },
  { id: "blue", color: "bg-blue-500", name: "Blue" },
  { id: "green", color: "bg-green-500", name: "Green" },
  { id: "yellow", color: "bg-yellow-500", name: "Yellow" },
  { id: "red", color: "bg-red-500", name: "Red" },
  { id: "purple", color: "bg-purple-500", name: "Purple" },
  { id: "pink", color: "bg-pink-500", name: "Pink" },
  { id: "orange", color: "bg-orange-500", name: "Orange" },
];

const folderOptions: Array<{ id: NoteFolder; name: string }> = [
  { id: "personal", name: "Personal" },
  { id: "work", name: "Work" },
  { id: "ideas", name: "Ideas" },
  { id: "learning", name: "Learning" },
  { id: "projects", name: "Projects" },
  { id: "journal", name: "Journal" },
  { id: "travel", name: "Travel" },
  { id: "finance", name: "Finance" },
  { id: "health", name: "Health" },
  { id: "documents", name: "Documents" },
];

export function NoteEditor({ note, isOpen, onClose, onSave }: NoteEditorProps) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");
  const [selectedFolder, setSelectedFolder] = React.useState<NoteFolder>("personal");
  const [selectedColor, setSelectedColor] = React.useState<NoteColor>("default");
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isPinned, setIsPinned] = React.useState(false);

  React.useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setSelectedFolder(note.folder);
      setSelectedColor(note.color);
      setIsFavorite(note.favorite);
      setIsPinned(note.pinned);
    } else {
      setTitle("");
      setContent("");
      setTags([]);
      setSelectedFolder("personal");
      setSelectedColor("default");
      setIsFavorite(false);
      setIsPinned(false);
    }
  }, [note]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      onSave({
        title: title.trim() || "Untitled Note",
        content: content.trim(),
        preview: content.trim().slice(0, 150),
        tags,
        folder: selectedFolder,
        color: selectedColor,
        favorite: isFavorite,
        pinned: isPinned,
        wordCount: content.trim().split(/\s+/).length,
        readingTime: Math.ceil(content.trim().split(/\s+/).length / 200),
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] overflow-auto"
        >
          <PremiumCard className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {note ? "Edit Note" : "Create Note"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isFavorite ? "text-pink-400 bg-pink-500/10" : "text-slate-400 hover:text-pink-400"
                  )}
                >
                  <Star className={cn("h-5 w-5", isFavorite && "fill-current")} />
                </button>
                <button
                  onClick={() => setIsPinned(!isPinned)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isPinned ? "text-amber-400 bg-amber-500/10" : "text-slate-400 hover:text-amber-400"
                  )}
                >
                  <Pin className={cn("h-5 w-5", isPinned && "fill-current")} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full text-3xl font-bold bg-transparent border-none text-white placeholder-slate-500 focus:outline-none"
            />

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-slate-400" />
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value as NoteFolder)}
                  className="px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 cursor-pointer"
                >
                  {folderOptions.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-slate-400" />
                <div className="flex gap-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={cn(
                        "w-6 h-6 rounded-full transition-all",
                        color.color,
                        selectedColor === color.id ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900" : ""
                      )}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                placeholder="Add tags..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm hover:bg-indigo-500/30 transition-colors"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="px-3 py-1 rounded-full bg-slate-700/50 border border-slate-600/50 text-slate-300 text-sm flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              className="w-full h-64 p-4 rounded-xl bg-slate-800/50 border-2 border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
            />

            <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
              <p className="text-xs text-slate-500">
                {content.trim().split(/\s+/).length} words • ~{Math.ceil(content.trim().split(/\s+/).length / 200)} min read
              </p>
              <div className="flex gap-2">
                <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                <PrimaryButton icon={<Save className="h-4 w-4" />} onClick={handleSave}>
                  Save Note
                </PrimaryButton>
              </div>
            </div>
          </PremiumCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
