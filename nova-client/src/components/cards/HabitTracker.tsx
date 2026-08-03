import * as React from "react";
import { Droplets, Dumbbell, BookOpen, Moon, Code } from "lucide-react";
import { PremiumCard } from "./PremiumCard";
import { Chip } from "../shared/Chip";

interface Habit {
  id: string;
  name: string;
  icon: React.ReactNode;
  completed: boolean;
  streak: number;
}

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
}

export function HabitTracker({ habits, onToggleHabit }: HabitTrackerProps) {
  return (
    <PremiumCard className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Habit Tracker</h3>
      <div className="flex flex-wrap gap-2">
        {habits.map((habit) => (
          <Chip
            key={habit.id}
            label={habit.streak > 0 ? `${habit.name} (${habit.streak}🔥)` : habit.name}
            selected={habit.completed}
            icon={habit.icon}
            onSelect={() => onToggleHabit(habit.id)}
          />
        ))}
      </div>
    </PremiumCard>
  );
}
