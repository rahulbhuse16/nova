import * as React from "react";
import { FileText, Pin, Plus } from "lucide-react";
import { PremiumCard } from "./PremiumCard";
import { PrimaryButton } from "../buttons/PrimaryButton";

interface Note {
  id: string;
  title: string;
  preview: string;
  pinned: boolean;
  updatedAt: string;
}

interface QuickNotesCardProps {
  notes: Note[];
  onAddNote: () => void;
}

export function QuickNotesCard({ notes, onAddNote }: QuickNotesCardProps) {
  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Quick Notes</h3>
        </div>
        <PrimaryButton size="sm" icon={<Plus className="h-4 w-4" />} onClick={onAddNote}>
          Add Note
        </PrimaryButton>
      </div>
      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {note.pinned && <Pin className="h-3 w-3 text-amber-400" />}
                  <h4 className="text-sm font-medium text-slate-200 truncate">{note.title}</h4>
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate">{note.preview}</p>
              </div>
              <span className="text-xs text-slate-600 whitespace-nowrap ml-2">{note.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}
