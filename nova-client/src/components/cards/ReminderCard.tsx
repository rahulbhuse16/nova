import * as React from "react";
import { Bell, CreditCard, Pill, Calendar, Cake } from "lucide-react";
import { PremiumCard } from "./PremiumCard";

interface Reminder {
  id: string;
  title: string;
  type: "bill" | "medicine" | "appointment" | "birthday";
  dueDate: string;
  amount?: string;
}

interface ReminderCardProps {
  reminders: Reminder[];
}

export function ReminderCard({ reminders }: ReminderCardProps) {
  const getReminderIcon = (type: Reminder["type"]) => {
    switch (type) {
      case "bill":
        return <CreditCard className="h-4 w-4" />;
      case "medicine":
        return <Pill className="h-4 w-4" />;
      case "appointment":
        return <Calendar className="h-4 w-4" />;
      case "birthday":
        return <Cake className="h-4 w-4" />;
    }
  };

  const getReminderColor = (type: Reminder["type"]) => {
    switch (type) {
      case "bill":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "medicine":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "appointment":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "birthday":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    }
  };

  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-amber-400" />
        <h3 className="text-lg font-semibold text-white">Smart Reminders</h3>
      </div>
      <div className="space-y-3">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className={`p-3 rounded-xl border ${getReminderColor(reminder.type)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${getReminderColor(reminder.type).split(" ")[1]}`}>
                  {getReminderIcon(reminder.type)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-200">{reminder.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{reminder.dueDate}</p>
                </div>
              </div>
              {reminder.amount && (
                <span className="text-sm font-semibold text-slate-200">{reminder.amount}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}
