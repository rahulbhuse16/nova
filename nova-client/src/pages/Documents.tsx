"use client";

import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FolderPlus, Search, Grid3x3, List, LayoutGrid } from "lucide-react";
import { AppShell } from "../components/layout/AppShell";
import { PageContainer } from "../components/layout/PageContainer";
import { PageSection } from "../components/layout/PageSection";
import { ContentGrid } from "../components/layout/ContentGrid";
import { PremiumCard } from "../components/cards/PremiumCard";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { SecondaryButton } from "../components/buttons/SecondaryButton";
import { DocumentOverview } from "../components/documents/DocumentOverview";
import { DocumentGrid } from "../components/documents/DocumentGrid";
import { DocumentList } from "../components/documents/DocumentList";
import { DocumentSidebar } from "../components/documents/DocumentSidebar";
import { DocumentFilters } from "../components/documents/DocumentFilters";
import { DocumentCategories } from "../components/documents/DocumentCategories";
import { DocumentPreview } from "../components/documents/DocumentPreview";
import { RecentDocuments } from "../components/documents/RecentDocuments";
import { FavoriteDocuments } from "../components/documents/FavoriteDocuments";
import { AISummaryCard } from "../components/documents/AISummaryCard";
import { DocumentQuickActions } from "../components/documents/DocumentQuickActions";
import { DocumentEmptyState } from "../components/documents/DocumentEmptyState";
import { DocumentSkeleton } from "../components/documents/DocumentSkeleton";
import { RootState } from "../store/store";
import {
  selectDocument,
  toggleFavorite,
  togglePin,
  setViewMode,
  setSearch,
  setSort,
  setCategory,
  setType,
  clearFilters,
  toggleFavoritesOnly,
  togglePinnedOnly,
} from "../redux/documentSlice";
import { ViewMode, DocumentCategory, DocumentType, SortBy } from "../types/document.types";

export default function Documents() {
  const dispatch = useDispatch();
  const {
    loading,
    documents,
    folders,
    selectedDocument,
    viewMode,
    sortBy,
    search,
    filters,
    favorites,
    recent,
    storage,
    overview,
    ui,
  } = useSelector((state: RootState) => state.documents);

  const [showPreview, setShowPreview] = React.useState(false);

  const handleSelectDocument = (id: string) => {
    dispatch(selectDocument(id));
    setShowPreview(true);
  };

  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavorite(id));
  };

  const handleTogglePin = (id: string) => {
    dispatch(togglePin(id));
  };

  const handleViewModeChange = (mode: ViewMode) => {
    dispatch(setViewMode(mode));
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearch(value));
  };

  const handleSortChange = (sort: SortBy) => {
    dispatch(setSort(sort));
  };

  const handleCategoryChange = (category: DocumentCategory | "all") => {
    dispatch(setCategory(category));
  };

  const handleTypeChange = (type: DocumentType | "all") => {
    dispatch(setType(type));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleQuickFilter = (filter: string) => {
    if (filter === "favorites") {
      dispatch(toggleFavoritesOnly());
    } else if (filter === "pinned") {
      dispatch(togglePinnedOnly());
    } else if (filter === "recent") {
      dispatch(setSort("date"));
    }
  };

  const filteredDocuments = React.useMemo(() => {
    let filtered = [...documents];

    if (search) {
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(search.toLowerCase()) ||
          doc.description?.toLowerCase().includes(search.toLowerCase()) ||
          doc.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (filters.type) {
      filtered = filtered.filter((doc) => doc.type === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter((doc) => doc.category === filters.category);
    }

    if (ui.showFavoritesOnly) {
      filtered = filtered.filter((doc) => doc.favorite);
    }

    if (ui.showPinnedOnly) {
      filtered = filtered.filter((doc) => doc.pinned);
    }

    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "size") {
      filtered.sort((a, b) => b.size - a.size);
    } else if (sortBy === "type") {
      filtered.sort((a, b) => a.type.localeCompare(b.type));
    }

    return filtered;
  }, [documents, search, filters, ui.showFavoritesOnly, ui.showPinnedOnly, sortBy]);

  const quickActions = [
    {
      id: "upload",
      label: "Upload Document",
      icon: <Upload className="h-5 w-5 text-indigo-400" />,
      color: "bg-indigo-500/20 border-indigo-500/20 hover:bg-indigo-500/30",
      onClick: () => console.log("Upload"),
    },
    {
      id: "scan",
      label: "Scan Document",
      icon: <Search className="h-5 w-5 text-cyan-400" />,
      color: "bg-cyan-500/20 border-cyan-500/20 hover:bg-cyan-500/30",
      onClick: () => console.log("Scan"),
    },
    {
      id: "folder",
      label: "Create Folder",
      icon: <FolderPlus className="h-5 w-5 text-emerald-400" />,
      color: "bg-emerald-500/20 border-emerald-500/20 hover:bg-emerald-500/30",
      onClick: () => console.log("Create folder"),
    },
    {
      id: "ai-search",
      label: "AI Search",
      icon: <Search className="h-5 w-5 text-purple-400" />,
      color: "bg-purple-500/20 border-purple-500/20 hover:bg-purple-500/30",
      onClick: () => console.log("AI search"),
    },
  ];

  const aiInsights = [
    {
      id: "1",
      type: "insight" as const,
      icon: <Search className="h-4 w-4 text-indigo-400" />,
      content: "You accessed Resume.pdf frequently this week.",
      color: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      id: "2",
      type: "warning" as const,
      icon: <FolderPlus className="h-4 w-4 text-amber-400" />,
      content: "Tax documents are missing for this month.",
      color: "bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "3",
      type: "suggestion" as const,
      icon: <Upload className="h-4 w-4 text-emerald-400" />,
      content: "Medical reports haven't been reviewed.",
      color: "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  if (loading) {
    return (
      <AppShell pageTitle="Documents" activeRoute="documents" onNavigate={() => {}}>
        <PageContainer>
          <PageSection title="Documents">
            <DocumentSkeleton />
          </PageSection>
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell pageTitle="Documents" activeRoute="documents" onNavigate={() => {}}>
      <PageContainer>
        <PageSection
          title="Documents"
          action={
            <div className="flex items-center gap-3">
              <PrimaryButton icon={<Upload className="h-4 w-4" />}>Upload</PrimaryButton>
              <SecondaryButton icon={<FolderPlus className="h-4 w-4" />}>Create Folder</SecondaryButton>
              <SecondaryButton icon={<Search className="h-4 w-4" />} variant="outline">
                AI Search
              </SecondaryButton>
            </div>
          }
        >
          <div className="space-y-6">
            <DocumentOverview
              totalDocuments={overview.totalDocuments}
              totalFolders={overview.totalFolders}
              favorites={overview.favorites}
              recentFiles={overview.recentFiles}
              storageUsed={overview.storageUsed}
              storageTotal={overview.storageTotal}
              aiIndexed={overview.aiIndexed}
            />

            <DocumentFilters
              search={search}
              onSearchChange={handleSearchChange}
              selectedType={filters.type || "all"}
              onTypeChange={handleTypeChange}
              selectedCategory={filters.category || "all"}
              onCategoryChange={handleCategoryChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              onClearFilters={handleClearFilters}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <DocumentCategories folders={folders} />

                <RecentDocuments
                  documents={recent}
                  onSelect={handleSelectDocument}
                  onToggleFavorite={handleToggleFavorite}
                  onTogglePin={handleTogglePin}
                />

                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">All Documents</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewModeChange("grid")}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        viewMode === "grid"
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                      )}
                    >
                      <Grid3x3 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleViewModeChange("list")}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        viewMode === "list"
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                      )}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {filteredDocuments.length === 0 ? (
                  <DocumentEmptyState />
                ) : viewMode === "grid" ? (
                  <DocumentGrid
                    documents={filteredDocuments}
                    onSelect={handleSelectDocument}
                    onToggleFavorite={handleToggleFavorite}
                    onTogglePin={handleTogglePin}
                  />
                ) : (
                  <DocumentList
                    documents={filteredDocuments}
                    onSelect={handleSelectDocument}
                    onToggleFavorite={handleToggleFavorite}
                    onTogglePin={handleTogglePin}
                  />
                )}
              </div>

              <div className="lg:col-span-1">
                <DocumentSidebar
                  recentActivity={recent}
                  pinnedFiles={documents.filter((d: any) => d.pinned)}
                  storageUsed={storage.used}
                  storageTotal={storage.total}
                  aiTip="Try using AI search to find documents by content, not just filename."
                  onQuickFilter={handleQuickFilter}
                />
              </div>
            </div>

            <ContentGrid columns={2} gap="lg">
              <FavoriteDocuments
                favorites={favorites}
                pinned={documents.filter((d: any) => d.pinned)}
                onSelect={handleSelectDocument}
                onToggleFavorite={handleToggleFavorite}
                onTogglePin={handleTogglePin}
              />

              <AISummaryCard
                insights={aiInsights}
                onSummarize={() => console.log("Summarize")}
                onFindSimilar={() => console.log("Find similar")}
                onOrganize={() => console.log("Organize")}
              />
            </ContentGrid>

            <DocumentQuickActions actions={quickActions} />
          </div>
        </PageSection>

        <AnimatePresence>
          {showPreview && selectedDocument && (
            <DocumentPreview
              document={selectedDocument}
              onClose={() => setShowPreview(false)}
              onToggleFavorite={handleToggleFavorite}
              onTogglePin={handleTogglePin}
            />
          )}
        </AnimatePresence>
      </PageContainer>
    </AppShell>
  );
}

import { cn } from "../lib/utils";
