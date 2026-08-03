"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, GripVertical, X } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface SubtaskListProps {
  subtasks: Subtask[];
  onSubtasksChange: (subtasks: Subtask[]) => void;
}

export function SubtaskList({ subtasks, onSubtasksChange }: SubtaskListProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState("");

  const addSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        title: newSubtaskTitle.trim(),
        completed: false,
      };
      onSubtasksChange([...subtasks, newSubtask]);
      setNewSubtaskTitle("");
    }
  };

  const toggleSubtask = (id: string) => {
    onSubtasksChange(
      subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
      )
    );
  };

  const deleteSubtask = (id: string) => {
    onSubtasksChange(subtasks.filter((subtask) => subtask.id !== id));
  };

  const updateSubtaskTitle = (id: string, title: string) => {
    onSubtasksChange(
      subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, title } : subtask
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addSubtask();
    }
  };

  return (
    <PremiumCard className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Subtasks</h3>
      
      <AnimatePresence>
        {subtasks.map((subtask, index) => (
          <motion.div
            key={subtask.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 group"
          >
            <GripVertical className="h-4 w-4 text-slate-600 cursor-grab" />
            <button
              onClick={() => toggleSubtask(subtask.id)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                subtask.completed
                  ? "bg-indigo-500 border-indigo-500"
                  : "border-slate-500 hover:border-indigo-400"
              }`}
            >
              {subtask.completed && <Check className="h-3 w-3 text-white" />}
            </button>
            <input
              type="text"
              value={subtask.title}
              onChange={(e) => updateSubtaskTitle(subtask.id, e.target.value)}
              className={`flex-1 bg-transparent text-sm focus:outline-none ${
                subtask.completed ? "text-slate-500 line-through" : "text-slate-200"
              }`}
            />
            <button
              onClick={() => deleteSubtask(subtask.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-700/50 rounded"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <button
          onClick={addSubtask}
          className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center hover:bg-indigo-500/20 transition-colors"
        >
          <Plus className="h-4 w-4 text-indigo-400" />
        </button>
        <input
          type="text"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a subtask..."
          className="flex-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>
    </PremiumCard>
  );
}
