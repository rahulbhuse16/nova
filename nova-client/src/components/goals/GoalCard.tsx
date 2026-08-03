"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Calendar, Flag, MoreVertical, ExternalLink, Edit, Archive, Trash2 } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Badge } from "../shared/Badge";
import { Goal, GoalPriority, GoalStatus } from "../../types/goal.types";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: Goal;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors: Record<GoalPriority, string> = {
  low: "bg-slate-500/20 text-slate-400 border-slate-500/20",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/20",
  high: "bg-rose-500/20 text-rose-400 border-rose-500/20",
  urgent: "bg-red-500/20 text-red-400 border-red-500/20",
};

const statusColors: Record<GoalStatus, string> = {
  not_started: "bg-slate-500/20 text-slate-400 border-slate-500/20",
  in_progress: "bg-indigo-500/20 text-indigo-400 border-indigo-500/20",
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  archived: "bg-slate-600/20 text-slate-500 border-slate-600/20",
  on_hold: "bg-amber-500/20 text-amber-400 border-amber-500/20",
};

const progressColor = (progress: number) => {
  if (progress >= 75) return "from-emerald-500 to-emerald-400";
  if (progress >= 50) return "from-indigo-500 to-indigo-400";
  if (progress >= 25) return "from-amber-500 to-amber-400";
  return "from-rose-500 to-rose-400";
};

const getDaysRemaining = (deadline: string): number => {
  const today = new Date();
  const due = new Date(deadline);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export function GoalCard({
  goal,
  onSelect,
  onToggleFavorite,
  onToggleComplete,
  onEdit,
  onArchive,
  onDelete,
}: GoalCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const daysRemaining = getDaysRemaining(goal.deadline);
  const isOverdue = daysRemaining < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative"
    >
      <PremiumCard
        className={cn(
          "p-5 cursor-pointer transition-all duration-300",
          goal.status === "completed" && "opacity-75"
        )}
        onClick={() => onSelect(goal.id)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl", goal.color)}>
              {goal.icon}
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">{goal.title}</h3>
              <p className="text-sm text-slate-400 mt-0.5 line-clamp-1">{goal.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(goal.id);
              }}
              className={cn(
                "p-2 rounded-lg transition-colors",
                goal.favorite ? "text-amber-400" : "text-slate-500 hover:text-amber-400"
              )}
            >
              <Star className={cn("h-4 w-4", goal.favorite && "fill-current")} />
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 rounded-lg text-slate-500 hover:text-white transition-colors"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-10 w-48 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden z-10"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(goal.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive(goal.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors"
                  >
                    <Archive className="h-4 w-4" />
                    Archive
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(goal.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Badge variant="neutral" className={priorityColors[goal.priority]}>
            <Flag className="h-3 w-3 mr-1" />
            {goal.priority}
          </Badge>
          <Badge variant="neutral" className={statusColors[goal.status]}>
            {goal.status.replace("_", " ")}
          </Badge>
          {goal.tags.map((tag) => (
            <Badge key={tag} variant="neutral" className="bg-slate-700/50 text-slate-300 border-slate-600/50">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Progress</span>
            <span className={cn(
              "font-semibold",
              goal.progress >= 75 ? "text-emerald-400" : goal.progress >= 50 ? "text-indigo-400" : "text-amber-400"
            )}>
              {goal.progress}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn("h-full rounded-full bg-gradient-to-r", progressColor(goal.progress))}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Calendar className="h-4 w-4" />
            <span className={cn(isOverdue && "text-rose-400")}>
              {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>{goal.milestones.filter((m) => m.completed).length}</span>
            <span>/</span>
            <span>{goal.milestones.length} milestones</span>
          </div>
        </div>

        {goal.status !== "completed" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(goal.id);
            }}
            className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
          >
            Mark Complete
          </button>
        )}
      </PremiumCard>
    </motion.div>
  );
}
