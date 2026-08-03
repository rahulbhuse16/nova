"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { User, Briefcase, Heart, DollarSign, BookOpen, Dumbbell, Plane, Building2, Users } from "lucide-react";
import { GoalCategory } from "../../types/goal.types";
import { cn } from "@/lib/utils";

interface GoalCategoryFilterProps {
  selectedCategory: GoalCategory | "all";
  onSelect: (category: GoalCategory | "all") => void;
}

const categories: Array<{ id: GoalCategory | "all"; label: string; icon: React.ReactNode; color: string }> = [
  { id: "all", label: "All", icon: <Users className="h-4 w-4" />, color: "bg-slate-500/20 text-slate-400 border-slate-500/20" },
  { id: "personal", label: "Personal", icon: <User className="h-4 w-4" />, color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/20" },
  { id: "career", label: "Career", icon: <Briefcase className="h-4 w-4" />, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" },
  { id: "health", label: "Health", icon: <Heart className="h-4 w-4" />, color: "bg-rose-500/20 text-rose-400 border-rose-500/20" },
  { id: "finance", label: "Finance", icon: <DollarSign className="h-4 w-4" />, color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/20" },
  { id: "learning", label: "Learning", icon: <BookOpen className="h-4 w-4" />, color: "bg-amber-500/20 text-amber-400 border-amber-500/20" },
  { id: "fitness", label: "Fitness", icon: <Dumbbell className="h-4 w-4" />, color: "bg-purple-500/20 text-purple-400 border-purple-500/20" },
  { id: "travel", label: "Travel", icon: <Plane className="h-4 w-4" />, color: "bg-teal-500/20 text-teal-400 border-teal-500/20" },
  { id: "business", label: "Business", icon: <Building2 className="h-4 w-4" />, color: "bg-orange-500/20 text-orange-400 border-orange-500/20" },
  { id: "family", label: "Family", icon: <Users className="h-4 w-4" />, color: "bg-pink-500/20 text-pink-400 border-pink-500/20" },
];

export function GoalCategoryFilter({ selectedCategory, onSelect }: GoalCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(category.id)}
          className={cn(
            "px-4 py-2 rounded-xl border-2 flex items-center gap-2 text-sm font-medium transition-all",
            selectedCategory === category.id
              ? category.color
              : "bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600/50 hover:text-slate-300"
          )}
        >
          {category.icon}
          <span>{category.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
