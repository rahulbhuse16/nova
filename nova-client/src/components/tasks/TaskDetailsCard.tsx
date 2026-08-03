"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Briefcase, User, BookOpen, ShoppingBag, Dumbbell, Heart, DollarSign, Plane } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Chip } from "../shared/Chip";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface TaskDetailsCardProps {
  title: string;
  description: string;
  category: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onCategoryChange: (category: string) => void;
}

const categories: Category[] = [
  { id: "work", name: "Work", icon: <Briefcase className="h-4 w-4" />, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { id: "personal", name: "Personal", icon: <User className="h-4 w-4" />, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { id: "learning", name: "Learning", icon: <BookOpen className="h-4 w-4" />, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { id: "shopping", name: "Shopping", icon: <ShoppingBag className="h-4 w-4" />, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { id: "fitness", name: "Fitness", icon: <Dumbbell className="h-4 w-4" />, color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  { id: "health", name: "Health", icon: <Heart className="h-4 w-4" />, color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  { id: "finance", name: "Finance", icon: <DollarSign className="h-4 w-4" />, color: "bg-green-500/10 text-green-400 border-green-500/20" },
  { id: "travel", name: "Travel", icon: <Plane className="h-4 w-4" />, color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
];

export function TaskDetailsCard({
  title,
  description,
  category,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
}: TaskDetailsCardProps) {
  return (
    <PremiumCard className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Task Title <span className="text-rose-400">*</span>
        </label>
        <motion.input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
          whileFocus={{ scale: 1.01 }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Description
        </label>
        <motion.textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Add more details about this task..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
          whileFocus={{ scale: 1.01 }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              selected={category === cat.id}
              icon={cat.icon}
              onSelect={() => onCategoryChange(cat.id)}
              className={category === cat.id ? cat.color : ""}
            />
          ))}
        </div>
      </div>
    </PremiumCard>
  );
}
