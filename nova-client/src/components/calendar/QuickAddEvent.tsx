import * as React from "react";
import { Modal } from "@/components/overlays/Modal";
import { TextField } from "@/components/inputs/TextField";
import { TextArea } from "@/components/inputs/TextArea";
import { Select } from "@/components/inputs/Select";
import { Switch } from "@/components/inputs/Switch";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createEvent } from "@/redux/calendarSlice";
import { selectSelectedDate } from "@/redux/calendarSelectors";
import { EVENT_TYPE_LABELS } from "./eventMeta";
import type { EventCategory, EventPriority, EventType } from "@/types/calendar.types";

export interface QuickAddEventProps {
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_OPTIONS = Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => ({ value, label }));
const CATEGORY_OPTIONS: { value: EventCategory; label: string }[] = [
  { value: "Work", label: "Work" },
  { value: "Health", label: "Health" },
  { value: "Personal", label: "Personal" },
  { value: "Finance", label: "Finance" },
  { value: "Learning", label: "Learning" },
  { value: "Family", label: "Family" },
  { value: "Social", label: "Social" },
];
const PRIORITY_OPTIONS: { value: EventPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const TYPE_COLORS: Record<EventType, string> = {
  meeting: "#7C6CF6",
  task: "#4FD1C5",
  reminder: "#F5A623",
  workout: "#6FCF97",
  birthday: "#FF8B6B",
  goal: "#6FCF97",
  finance: "#F5A623",
  health: "#EF5D6F",
  travel: "#4FD1C5",
  learning: "#7C6CF6",
  personal: "#F5A623",
};

export function QuickAddEvent({ isOpen, onClose }: QuickAddEventProps) {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector(selectSelectedDate);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<string>("meeting");
  const [category, setCategory] = React.useState<EventCategory>("Work");
  const [priority, setPriority] = React.useState<EventPriority>("medium");
  const [location, setLocation] = React.useState("");
  const [allDay, setAllDay] = React.useState(false);
  const [startTime, setStartTime] = React.useState("09:00");
  const [durationMin, setDurationMin] = React.useState(30);

  function reset() {
    setTitle("");
    setDescription("");
    setType("meeting");
    setCategory("Work");
    setPriority("medium");
    setLocation("");
    setAllDay(false);
    setStartTime("09:00");
    setDurationMin(30);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const [h, m] = startTime.split(":").map(Number);
    const start = new Date(`${selectedDate}T00:00:00`);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + durationMin * 60000);

    dispatch(
      createEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        type: type as EventType,
        category,
        priority,
        location: location.trim() || undefined,
        allDay,
        startDate: start.toISOString().slice(0, 19),
        endDate: end.toISOString().slice(0, 19),
        color: TYPE_COLORS[type as EventType],
        icon: "CalendarDays",
      })
    );

    reset();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New event" description="Add it to your day — Nova will slot it in." size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Title" placeholder="e.g. Team sync" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <TextArea
          label="Description"
          placeholder="Optional details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select label="Type" options={TYPE_OPTIONS} value={type} onChange={setType} />
          <Select
            label="Category"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(v) => setCategory(v as EventCategory)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Priority"
            options={PRIORITY_OPTIONS}
            value={priority}
            onChange={(v) => setPriority(v as EventPriority)}
          />
          <TextField label="Location" placeholder="Optional" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <Switch checked={allDay} onChange={setAllDay} label="All-day event" />

        {!allDay && (
          <div className="grid grid-cols-2 gap-3">
            <TextField
              type="time"
              label="Start time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <TextField
              type="number"
              label="Duration (minutes)"
              min={15}
              step={15}
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value))}
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <SecondaryButton type="button" variant="ghost" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" variant="gradient">
            Create event
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
