"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { DocumentType, DocumentCategory, SortBy } from "../../types/document.types";
import { cn } from "@/lib/utils";

interface DocumentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: DocumentType | "all";
  onTypeChange: (type: DocumentType | "all") => void;
  selectedCategory: DocumentCategory | "all";
  onCategoryChange: (category: DocumentCategory | "all") => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  onClearFilters: () => void;
}

const documentTypes: Array<{ id: DocumentType | "all"; label: string; icon: string }> = [
  { id: "all", label: "All Types", icon: "📁" },
  { id: "pdf", label: "PDF", icon: "📄" },
  { id: "image", label: "Images", icon: "🖼️" },
  { id: "word", label: "Word", icon: "📝" },
  { id: "excel", label: "Excel", icon: "📊" },
  { id: "powerpoint", label: "PowerPoint", icon: "📽️" },
  { id: "note", label: "Notes", icon: "📒" },
  { id: "receipt", label: "Receipts", icon: "🧾" },
  { id: "certificate", label: "Certificates", icon: "🎓" },
  { id: "invoice", label: "Invoices", icon: "💳" },
  { id: "contract", label: "Contracts", icon: "📋" },
];

const sortOptions: Array<{ id: SortBy; label: string }> = [
  { id: "date", label: "Date Modified" },
  { id: "name", label: "Name" },
  { id: "size", label: "Size" },
  { id: "type", label: "Type" },
];

export function DocumentFilters({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  onClearFilters,
}: DocumentFiltersProps) {
  const hasActiveFilters = search || selectedType !== "all" || selectedCategory !== "all";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50 transition-colors flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as DocumentType | "all")}
          className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
        >
          {documentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.icon} {type.label}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as DocumentCategory | "all")}
          className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="finance">Finance</option>
          <option value="medical">Medical</option>
          <option value="travel">Travel</option>
          <option value="education">Education</option>
          <option value="projects">Projects</option>
          <option value="certificates">Certificates</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortBy)}
          className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
