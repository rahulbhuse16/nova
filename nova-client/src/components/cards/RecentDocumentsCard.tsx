import * as React from "react";
import { File, FileText, Image, Folder } from "lucide-react";
import { PremiumCard } from "./PremiumCard";

interface Document {
  id: string;
  name: string;
  type: "document" | "image" | "folder" | "other";
  openedAt: string;
}

interface RecentDocumentsCardProps {
  documents: Document[];
}

export function RecentDocumentsCard({ documents }: RecentDocumentsCardProps) {
  const getDocumentIcon = (type: Document["type"]) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      case "folder":
        return <Folder className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getDocumentColor = (type: Document["type"]) => {
    switch (type) {
      case "document":
        return "bg-blue-500/10 text-blue-400";
      case "image":
        return "bg-purple-500/10 text-purple-400";
      case "folder":
        return "bg-amber-500/10 text-amber-400";
      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };

  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center gap-2">
        <File className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Recent Documents</h3>
      </div>
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-lg ${getDocumentColor(doc.type)} flex items-center justify-center`}>
              {getDocumentIcon(doc.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-slate-200 truncate">{doc.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">Opened {doc.openedAt}</p>
            </div>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}
