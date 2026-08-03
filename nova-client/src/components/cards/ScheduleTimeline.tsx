import * as React from "react";
import { Video, MapPin, Clock } from "lucide-react";
import { PremiumCard } from "./PremiumCard";

interface Event {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: "meeting" | "event" | "call";
  location?: string;
}

interface ScheduleTimelineProps {
  events: Event[];
}

export function ScheduleTimeline({ events }: ScheduleTimelineProps) {
  const getEventIcon = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return <Video className="h-4 w-4" />;
      case "call":
        return <Video className="h-4 w-4" />;
      case "event":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "call":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "event":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <PremiumCard className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Today's Schedule</h3>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${getEventColor(
                  event.type
                )}`}
              >
                {getEventIcon(event.type)}
              </div>
              {index < events.length - 1 && (
                <div className="w-0.5 h-full bg-slate-700/50 mt-2" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-200">{event.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-500">
                      {event.time} · {event.duration}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-500">{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}
