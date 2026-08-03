import * as React from "react";
import { Chip } from "@/components/shared/Chip";
import { Switch } from "@/components/inputs/Switch";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectFilters } from "@/redux/calendarSelectors";
import { setFilter, resetFilters } from "@/redux/calendarSlice";
import { EVENT_TYPE_LABELS } from "./eventMeta";
import type { EventType } from "@/types/calendar.types";

const TYPES = Object.keys(EVENT_TYPE_LABELS) as EventType[];

export function CalendarFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  function toggleType(type: EventType) {
    const next = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    dispatch(setFilter({ key: "types", value: next }));
  }

  const hasActiveFilters = filters.types.length > 0 || !filters.showCompleted;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {TYPES.map((type) => (
        <Chip
          key={type}
          label={EVENT_TYPE_LABELS[type]}
          selected={filters.types.includes(type)}
          onSelect={() => toggleType(type)}
        />
      ))}

      <span className="mx-1 h-5 w-px bg-border" />

      <Switch
        checked={filters.showCompleted}
        onChange={(v) => dispatch(setFilter({ key: "showCompleted", value: v }))}
        label="Show completed"
        className="w-auto"
      />

      {hasActiveFilters && (
        <SecondaryButton variant="ghost" size="sm" onClick={() => dispatch(resetFilters())}>
          Clear
        </SecondaryButton>
      )}
    </div>
  );
}
