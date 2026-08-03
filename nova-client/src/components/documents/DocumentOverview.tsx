"use client";

import * as React from "react";
import { FileText, Folder, Star, Clock, HardDrive, Sparkles } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { StatCard } from "../cards/StatCard";
import { ContentGrid } from "../layout/ContentGrid";

interface DocumentOverviewProps {
  totalDocuments: number;
  totalFolders: number;
  favorites: number;
  recentFiles: number;
  storageUsed: number;
  storageTotal: number;
  aiIndexed: number;
}

export function DocumentOverview({
  totalDocuments,
  totalFolders,
  favorites,
  recentFiles,
  storageUsed,
  storageTotal,
  aiIndexed,
}: DocumentOverviewProps) {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const storagePercentage = Math.round((storageUsed / storageTotal) * 100);

  return (
    <ContentGrid columns={4} gap="md">
      <StatCard
        label="Total Documents"
        value={totalDocuments.toString()}
        icon={<FileText className="h-5 w-5 text-indigo-400" />}
        trend={{
          direction: "up" as const,
          value: "+3 this week",
          positiveIsGood: true,
        }}
      />

      <StatCard
        label="Folders"
        value={totalFolders.toString()}
        icon={<Folder className="h-5 w-5 text-emerald-400" />}
        trend={{
          direction: "up" as const,
          value: "+1 new",
          positiveIsGood: true,
        }}
      />

      <StatCard
        label="Favorites"
        value={favorites.toString()}
        icon={<Star className="h-5 w-5 text-amber-400" />}
        trend={{
          direction: "up" as const,
          value: "+2 pinned",
          positiveIsGood: true,
        }}
      />

      <StatCard
        label="Recent Files"
        value={recentFiles.toString()}
        icon={<Clock className="h-5 w-5 text-cyan-400" />}
        trend={{
          direction: "up" as const,
          value: "Today",
          positiveIsGood: true,
        }}
      />

      <StatCard
        label="Storage Used"
        value={`${storagePercentage}%`}
        unit={formatBytes(storageUsed)}
        icon={<HardDrive className="h-5 w-5 text-rose-400" />}
        trend={{
          direction: "down" as const,
          value: "Of 10GB",
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
