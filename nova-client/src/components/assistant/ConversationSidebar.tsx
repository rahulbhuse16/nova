"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Search, Pin, Star, Clock, MoreVertical, Trash2, Edit2, X } from "lucide-react";
import { Conversation } from "../../types/assistant.types";
import { PremiumCard } from "../cards/PremiumCard";
import { cn } from "@/lib/utils";

interface ConversationSidebarProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

export function ConversationSidebar({
  conversations,
  selectedConversation,
  searchQuery,
  onSearchChange,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  onTogglePin,
  onToggleFavorite,
  isOpen = true,
  onClose,
}: ConversationSidebarProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");

  const filteredConversations = React.useMemo(() => {
    if (!searchQuery) return conversations;
    return conversations.filter((conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const pinnedConversations = filteredConversations.filter((c) => c.isPinned);
  const otherConversations = filteredConversations.filter((c) => !c.isPinned);

  const handleStartEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      onRenameConversation(editingId, editTitle.trim());
      setEditingId(null);
      setEditTitle("");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="hidden lg:block w-80 border-r border-slate-700/50 flex flex-col bg-slate-900/50">
          <div className="p-4 space-y-3">
            <button
              onClick={onNewConversation}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-white font-medium hover:from-indigo-500/30 hover:to-purple-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
            {pinnedConversations.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Pin className="h-3 w-3" />
                  Pinned
                </p>
                <div className="space-y-2">
                  {pinnedConversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isSelected={selectedConversation === conv.id}
                      onSelect={() => onSelectConversation(conv.id)}
                      onDelete={() => onDeleteConversation(conv.id)}
                      onRename={() => handleStartEdit(conv.id, conv.title)}
                      onTogglePin={() => onTogglePin(conv.id)}
                      onToggleFavorite={() => onToggleFavorite(conv.id)}
                      isEditing={editingId === conv.id}
                      editTitle={editTitle}
                      onEditTitleChange={setEditTitle}
                      onSaveEdit={handleSaveEdit}
                    />
                  ))}
                </div>
              </div>
            )}

            {otherConversations.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Recent
                </p>
                <div className="space-y-2">
                  {otherConversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isSelected={selectedConversation === conv.id}
                      onSelect={() => onSelectConversation(conv.id)}
                      onDelete={() => onDeleteConversation(conv.id)}
                      onRename={() => handleStartEdit(conv.id, conv.title)}
                      onTogglePin={() => onTogglePin(conv.id)}
                      onToggleFavorite={() => onToggleFavorite(conv.id)}
                      isEditing={editingId === conv.id}
                      editTitle={editTitle}
                      onEditTitleChange={setEditTitle}
                      onSaveEdit={handleSaveEdit}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredConversations.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">No conversations found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
          <div className="w-80 h-full bg-slate-900/95 border-r border-slate-700/50 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 space-y-3 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Conversations</h3>
                <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={onNewConversation}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-white font-medium hover:from-indigo-500/30 hover:to-purple-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
              {pinnedConversations.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Pin className="h-3 w-3" />
                    Pinned
                  </p>
                  <div className="space-y-2">
                    {pinnedConversations.map((conv) => (
                      <ConversationItem
                        key={conv.id}
                        conversation={conv}
                        isSelected={selectedConversation === conv.id}
                        onSelect={() => {
                          onSelectConversation(conv.id);
                          onClose?.();
                        }}
                        onDelete={() => onDeleteConversation(conv.id)}
                        onRename={() => handleStartEdit(conv.id, conv.title)}
                        onTogglePin={() => onTogglePin(conv.id)}
                        onToggleFavorite={() => onToggleFavorite(conv.id)}
                        isEditing={editingId === conv.id}
                        editTitle={editTitle}
                        onEditTitleChange={setEditTitle}
                        onSaveEdit={handleSaveEdit}
                      />
                    ))}
                  </div>
                </div>
              )}

              {otherConversations.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Recent
                  </p>
                  <div className="space-y-2">
                    {otherConversations.map((conv) => (
                      <ConversationItem
                        key={conv.id}
                        conversation={conv}
                        isSelected={selectedConversation === conv.id}
                        onSelect={() => {
                          onSelectConversation(conv.id);
                          onClose?.();
                        }}
                        onDelete={() => onDeleteConversation(conv.id)}
                        onRename={() => handleStartEdit(conv.id, conv.title)}
                        onTogglePin={() => onTogglePin(conv.id)}
                        onToggleFavorite={() => onToggleFavorite(conv.id)}
                        isEditing={editingId === conv.id}
                        editTitle={editTitle}
                        onEditTitleChange={setEditTitle}
                        onSaveEdit={handleSaveEdit}
                      />
                    ))}
                  </div>
                </div>
              )}

              {filteredConversations.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">No conversations found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: () => void;
  onTogglePin: () => void;
  onToggleFavorite: () => void;
  isEditing: boolean;
  editTitle: string;
  onEditTitleChange: (value: string) => void;
  onSaveEdit: () => void;
}

function ConversationItem({
  conversation,
  isSelected,
  onSelect,
  onDelete,
  onRename,
  onTogglePin,
  onToggleFavorite,
  isEditing,
  editTitle,
  onEditTitleChange,
  onSaveEdit,
}: ConversationItemProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <motion.div
      whileHover={{ x: 2 }}
      className="relative group"
    >
      <div
        onClick={onSelect}
        className={cn(
          "p-3 rounded-xl border-2 cursor-pointer transition-all",
          isSelected
            ? "bg-indigo-500/20 border-indigo-500/50"
            : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50"
        )}
      >
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => onEditTitleChange(e.target.value)}
            onBlur={onSaveEdit}
            onKeyDown={(e) => e.key === "Enter" && onSaveEdit()}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-transparent border-none text-white focus:outline-none"
            autoFocus
          />
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{conversation.title}</p>
                <p className="text-xs text-slate-400 mt-1">{formatDate(conversation.updatedAt)}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {conversation.isPinned && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin();
                    }}
                    className="p-1 rounded text-amber-400 hover:bg-amber-500/10"
                  >
                    <Pin className="h-3 w-3 fill-current" />
                  </button>
                )}
                {conversation.isFavorite && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite();
                    }}
                    className="p-1 rounded text-pink-400 hover:bg-pink-500/10"
                  >
                    <Star className="h-3 w-3 fill-current" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1 rounded text-slate-500 hover:text-white"
                >
                  <MoreVertical className="h-3 w-3" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-0 top-10 w-36 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden z-10"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRename();
              setShowMenu(false);
            }}
            className="w-full px-4 py-2.5 flex items-center gap-2 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Rename
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
              setShowMenu(false);
            }}
            className="w-full px-4 py-2.5 flex items-center gap-2 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            <Pin className="h-4 w-4" />
            {conversation.isPinned ? "Unpin" : "Pin"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
              setShowMenu(false);
            }}
            className="w-full px-4 py-2.5 flex items-center gap-2 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            <Star className="h-4 w-4" />
            {conversation.isFavorite ? "Unfavorite" : "Favorite"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setShowMenu(false);
            }}
            className="w-full px-4 py-2.5 flex items-center gap-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
