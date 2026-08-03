"use client";

import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "../components/layout/AppShell";
import { PageContainer } from "../components/layout/PageContainer";
import { PageSection } from "../components/layout/PageSection";
import { ContentGrid } from "../components/layout/ContentGrid";
import { PremiumCard } from "../components/cards/PremiumCard";
import { RootState } from "../store/store";
import {
  selectNote,
  createNote,
  updateNote,
  deleteNote,
  duplicateNote,
  toggleFavorite,
  togglePinned,
  archiveNote,
  restoreNote,
  setSearch,
  setFilter,
  setSort,
  setViewMode,
} from "../redux/notesSlice";
import { Note, NoteFolder, NoteColor, SortBy } from "../types/note.types";
import { NotesHeader } from "../components/notes/NotesHeader";
import { NotesOverview } from "../components/notes/NotesOverview";
import { NotesGrid } from "../components/notes/NotesGrid";
import { NotesList } from "../components/notes/NotesList";
import { NotesSidebar } from "../components/notes/NotesSidebar";
import { NotesSearch } from "../components/notes/NotesSearch";
import { NotesFilters } from "../components/notes/NotesFilters";
import { PinnedNotes } from "../components/notes/PinnedNotes";
import { RecentNotes } from "../components/notes/RecentNotes";
import { FavoriteNotes } from "../components/notes/FavoriteNotes";
import { TagsCloud } from "../components/notes/TagsCloud";
import { NotePreview } from "../components/notes/NotePreview";
import { AINoteInsights } from "../components/notes/AINoteInsights";
import { QuickCapture } from "../components/notes/QuickCapture";
import { RelatedNotes } from "../components/notes/RelatedNotes";
import { NotesQuickActions } from "../components/notes/NotesQuickActions";
import { NotesEmptyState } from "../components/notes/NotesEmptyState";
import { NotesSkeleton } from "../components/notes/NotesSkeleton";
import { NoteEditor } from "../components/notes/NoteEditor";

export default function Notes() {
  const dispatch = useDispatch();
  const {
    loading,
    notes,
    folders,
    selectedNote,
    search,
    filters,
    viewMode,
    sortBy,
    favorites,
    pinned,
    recent,
    tags,
    overview,
    ui,
  } = useSelector((state: RootState) => state.notes);

  const [showPreview, setShowPreview] = React.useState(false);
  const [showEditor, setShowEditor] = React.useState(false);
  const [showQuickCapture, setShowQuickCapture] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<Note | null>(null);

  const handleSelectNote = (id: string) => {
    dispatch(selectNote(id));
    setShowPreview(true);
  };

  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavorite(id));
  };

  const handleTogglePin = (id: string) => {
    dispatch(togglePinned(id));
  };

  const handleDuplicate = (id: string) => {
    dispatch(duplicateNote(id));
  };

  const handleArchive = (id: string) => {
    dispatch(archiveNote(id));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteNote(id));
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    dispatch(setViewMode(mode));
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearch(value));
  };

  const handleSortChange = (sort: SortBy) => {
    dispatch(setSort(sort));
  };

  const handleFolderChange = (folder: NoteFolder) => {
    dispatch(setFilter({ key: "folder", value: folder === "all" ? undefined : folder }));
  };

  const handleColorChange = (color: NoteColor | "all") => {
    dispatch(setFilter({ key: "color", value: color === "all" ? undefined : color }));
  };

  const handleClearFilters = () => {
    dispatch(setFilter({ key: "folder", value: undefined }));
    dispatch(setFilter({ key: "color", value: undefined }));
    dispatch(setFilter({ key: "tags", value: undefined }));
  };

  const handleQuickFilter = (filter: string) => {
    if (filter === "favorites") {
      dispatch(setFilter({ key: "tags", value: undefined }));
    } else if (filter === "pinned") {
      dispatch(setFilter({ key: "tags", value: undefined }));
    } else if (filter === "recent") {
      dispatch(setSort("updated"));
    }
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setShowEditor(true);
  };

  const handleEditNote = () => {
    setEditingNote(selectedNote);
    setShowEditor(true);
    setShowPreview(false);
  };

  const handleSaveNote = (noteData: Partial<Note>) => {
    if (editingNote) {
      dispatch(updateNote({ id: editingNote.id, updates: noteData }));
    } else {
      dispatch(
        createNote({
          id: `${Date.now()}`,
          title: noteData.title || "Untitled Note",
          content: noteData.content || "",
          preview: noteData.preview || "",
          folder: noteData.folder || "personal",
          tags: noteData.tags || [],
          favorite: noteData.favorite || false,
          pinned: noteData.pinned || false,
          color: noteData.color || "default",
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
          lastViewed: new Date().toISOString().split("T")[0],
          wordCount: noteData.wordCount || 0,
          readingTime: noteData.readingTime || 0,
          status: "active",
        })
      );
    }
  };

  const handleQuickCaptureSave = (content: string, type: "text" | "checklist" | "voice" | "image") => {
    dispatch(
      createNote({
        id: `${Date.now()}`,
        title: type === "checklist" ? "Quick Checklist" : "Quick Note",
        content: content,
        preview: content.slice(0, 150),
        folder: "ideas",
        tags: ["quick-capture"],
        favorite: false,
        pinned: false,
        color: "default",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        lastViewed: new Date().toISOString().split("T")[0],
        wordCount: content.split(/\s+/).length,
        readingTime: Math.ceil(content.split(/\s+/).length / 200),
        status: "active",
      })
    );
  };

  const filteredNotes = React.useMemo(() => {
    let filtered = [...notes];

    if (search) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase()) ||
          note.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (filters.folder) {
      filtered = filtered.filter((note) => note.folder === filters.folder);
    }

    if (filters.color) {
      filtered = filtered.filter((note) => note.color === filters.color);
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((note) =>
        filters.tags!.some((tag: string) => note.tags.includes(tag))
      );
    }

    if (sortBy === "updated") {
      filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (sortBy === "created") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }

    return filtered;
  }, [notes, search, filters, sortBy]);

  const quickActions = [
    {
      id: "create",
      label: "Create Note",
      icon: <Plus className="h-5 w-5 text-indigo-400" />,
      color: "bg-indigo-500/20 border-indigo-500/20 hover:bg-indigo-500/30",
      onClick: handleNewNote,
    },
    {
      id: "voice",
      label: "Voice Note",
      icon: <Mic className="h-5 w-5 text-cyan-400" />,
      color: "bg-cyan-500/20 border-cyan-500/20 hover:bg-cyan-500/30",
      onClick: () => setShowQuickCapture(true),
    },
    {
      id: "checklist",
      label: "Checklist",
      icon: <CheckSquare className="h-5 w-5 text-emerald-400" />,
      color: "bg-emerald-500/20 border-emerald-500/20 hover:bg-emerald-500/30",
      onClick: () => setShowQuickCapture(true),
    },
    {
      id: "ai-summary",
      label: "AI Summary",
      icon: <Sparkles className="h-5 w-5 text-purple-400" />,
      color: "bg-purple-500/20 border-purple-500/20 hover:bg-purple-500/30",
      onClick: () => console.log("AI Summary"),
    },
  ];

  const aiInsights = [
    {
      id: "1",
      type: "insight" as const,
      icon: <Lightbulb className="h-4 w-4 text-indigo-400" />,
      content: "This note relates to your Nova MVP goal.",
      color: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      id: "2",
      type: "suggestion" as const,
      icon: <CheckCircle className="h-4 w-4 text-emerald-400" />,
      content: "Three notes discuss Finance topics.",
      color: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "3",
      type: "connection" as const,
      icon: <Link2 className="h-4 w-4 text-cyan-400" />,
      content: "You mentioned React in 12 notes.",
      color: "bg-cyan-500/10 border-cyan-500/20",
    },
  ];

  const hasActiveFilters = !!filters.folder || !!filters.color || !!filters.tags;

  if (loading) {
    return (
      <AppShell pageTitle="Notes" activeRoute="notes" onNavigate={() => {}}>
        <PageContainer>
          <PageSection title="Notes">
            <NotesSkeleton />
          </PageSection>
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell pageTitle="Notes" activeRoute="notes" onNavigate={() => {}}>
      <PageContainer>
        <PageSection title="Notes">
          <div className="space-y-6">
            <NotesHeader
              onNewNote={handleNewNote}
              onQuickCapture={() => setShowQuickCapture(true)}
              onAIAssistant={() => console.log("AI Assistant")}
            />

            <NotesOverview
              totalNotes={overview.totalNotes}
              totalFolders={overview.totalFolders}
              pinned={overview.pinned}
              favorites={overview.favorites}
              recent={overview.recent}
              aiIndexed={overview.aiIndexed}
            />

            <NotesSearch
              search={search}
              onSearchChange={handleSearchChange}
              recentSearches={["Nova", "React", "Finance", "Planning"]}
              suggestedFilters={["Favorites", "Pinned", "Recent", "This Week"]}
              onRecentSearchClick={handleSearchChange}
              onSuggestedFilterClick={handleQuickFilter}
            />

            <NotesFilters
              selectedFolder={filters.folder || "all"}
              onFolderChange={handleFolderChange}
              selectedColor={filters.color || "all"}
              onColorChange={handleColorChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <PinnedNotes
                  pinnedNotes={pinned}
                  onSelect={handleSelectNote}
                  onToggleFavorite={handleToggleFavorite}
                  onTogglePin={handleTogglePin}
                  onDuplicate={handleDuplicate}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                />

                <RecentNotes
                  recentNotes={recent}
                  onSelect={handleSelectNote}
                  onToggleFavorite={handleToggleFavorite}
                  onTogglePin={handleTogglePin}
                  onDuplicate={handleDuplicate}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                />

                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">All Notes</h2>
                </div>

                {filteredNotes.length === 0 ? (
                  <NotesEmptyState onCreateNote={handleNewNote} onQuickCapture={() => setShowQuickCapture(true)} />
                ) : viewMode === "grid" ? (
                  <NotesGrid
                    notes={filteredNotes}
                    onSelect={handleSelectNote}
                    onToggleFavorite={handleToggleFavorite}
                    onTogglePin={handleTogglePin}
                    onDuplicate={handleDuplicate}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                  />
                ) : (
                  <NotesList
                    notes={filteredNotes}
                    onSelect={handleSelectNote}
                    onToggleFavorite={handleToggleFavorite}
                    onTogglePin={handleTogglePin}
                    onDuplicate={handleDuplicate}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                  />
                )}
              </div>

              <div className="lg:col-span-1">
                <NotesSidebar
                  todayNotes={recent}
                  recentlyEdited={recent}
                  pinnedNotes={pinned}
                  writingStreak={7}
                  aiTip="Try using AI to connect related notes and discover patterns in your thinking."
                  onQuickFilter={handleQuickFilter}
                />
              </div>
            </div>

            <ContentGrid columns={2} gap="lg">
              <FavoriteNotes
                favoriteNotes={favorites}
                onSelect={handleSelectNote}
                onToggleFavorite={handleToggleFavorite}
                onTogglePin={handleTogglePin}
                onDuplicate={handleDuplicate}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />

              <TagsCloud tags={tags} onTagClick={(tag: string) => dispatch(setFilter({ key: "tags", value: [tag] }))} />
            </ContentGrid>

            <ContentGrid columns={2} gap="lg">
              <AINoteInsights
                insights={aiInsights}
                onSummarize={() => console.log("Summarize")}
                onGenerateTasks={() => console.log("Generate Tasks")}
                onFindRelated={() => console.log("Find Related")}
              />

              <RelatedNotes
                relatedNotes={recent.slice(0, 3)}
                relatedGoals={[
                  { id: "1", title: "Complete Nova MVP" },
                  { id: "2", title: "Learn Advanced React" },
                ]}
                relatedTasks={[
                  { id: "1", title: "Review architecture" },
                  { id: "2", title: "Write documentation" },
                ]}
                relatedDocuments={[
                  { id: "1", title: "Architecture Doc" },
                  { id: "2", title: "API Reference" },
                ]}
                onNoteClick={handleSelectNote}
              />
            </ContentGrid>

            <NotesQuickActions actions={quickActions} />
          </div>
        </PageSection>

        <AnimatePresence>
          {showPreview && selectedNote && (
            <NotePreview
              note={selectedNote}
              onClose={() => setShowPreview(false)}
              onEdit={handleEditNote}
              onToggleFavorite={handleToggleFavorite}
              onTogglePin={handleTogglePin}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEditor && (
            <NoteEditor
              note={editingNote}
              isOpen={showEditor}
              onClose={() => setShowEditor(false)}
              onSave={handleSaveNote}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showQuickCapture && (
            <QuickCapture
              isOpen={showQuickCapture}
              onClose={() => setShowQuickCapture(false)}
              onCapture={handleQuickCaptureSave}
            />
          )}
        </AnimatePresence>
      </PageContainer>
    </AppShell>
  );
}

import { Plus, Mic, CheckSquare, Sparkles, Lightbulb, CheckCircle, Link2 } from "lucide-react";
