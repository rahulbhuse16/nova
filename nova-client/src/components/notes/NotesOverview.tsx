"use client";

import * as React from "react";
import { FileText, Pin, Star, Clock, Folder, Sparkles } from "lucide-react";
import { StatCard } from "../cards/StatCard";
import { ContentGrid } from "../layout/ContentGrid";

interface NotesOverviewProps {
  totalNotes: number;
  totalFolders: number;
  pinned: number;
  favorites: number;
  recent: number;
  aiIndexed: number;
}

export function NotesOverview({
  totalNotes,
  totalFolders,
  pinned,
  favorites,
  recent,
  aiIndexed,
}: NotesOverviewProps) {
  return (
    <ContentGrid columns={4} gap="md">
      <StatCard
        label="Total Notes"
        value={totalNotes.toString()}
        icon={<FileText className="h-5 w-5 text-indigo-400" />}
        trend={{
          direction: "up" as const,
          value: "+5 this week",
          positiveIsGood: true,
        }}
      />

      <StatCard
        label="Folders"
        value={totalFolders.toString()}
        icon={<Folder className="h-5 w-5 text-emerald-400" />}
        trend={{
          direction: "up" as const,
          value: "Organized",
          positiveIsGood: true,
        }}
      />

      <StatCard
        label="Pinned"
        value={pinned.toString()}
        icon={<Pin className="h-5 w-5 text-amber-400" />}
        trend={{
          direction: "up" as const,
          value: "Quick access",
          positiveIsGood: true,
        }}
      />

      <StatCard
        label="Favorites"
        value={favorites.toString()}
        icon={<Star className="h-5 w-5 text-pink-400" />}
        trend={{
          direction: "up" as const,
          value: "+2 new",
          positiveIsGood: true,
        }}
      />

      <StatCard
        label="Recent"
        value={recent.toString()}
        icon={<Clock className="h-5 w-5 text-cyan-400" />}
        trend={{
          direction: "up" as const,
          value: "Today",
          positiveIsGood: true,
        }}
      />

      <StatCard
        label="AI Indexed"
        value={aiIndexed.toString()}
        icon={<Sparkles className="h-5 w-5 text-purple-400" />}
        trend={{
          direction: "up" as const,
          value: "100%",
          positiveIsGood: true,
        }}
      />
    </ContentGrid>
  );
}
