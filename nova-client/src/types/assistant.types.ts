export type MessageType = "user" | "assistant" | "system" | "task" | "goal" | "calendar" | "finance" | "note" | "document" | "reminder";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: string;
  conversationId: string;
  isStreaming?: boolean;
  isEdited?: boolean;
  reaction?: "like" | "dislike" | null;
  attachments?: Attachment[];
  metadata?: {
    taskId?: string;
    goalId?: string;
    eventId?: string;
    noteId?: string;
    documentId?: string;
    reminderId?: string;
  };
}

export interface Attachment {
  id: string;
  name: string;
  type: "image" | "pdf" | "word" | "excel" | "text";
  size: number;
  url: string;
  preview?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isFavorite: boolean;
  context?: ConversationContext;
}

export interface ConversationContext {
  tasks?: string[];
  goals?: string[];
  notes?: string[];
  documents?: string[];
  calendarEvents?: string[];
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  action: string;
}

export interface Suggestion {
  id: string;
  text: string;
  icon: string;
  category: "planning" | "productivity" | "review" | "creation" | "analysis";
}

export interface AssistantState {
  loading: boolean;
  messages: Message[];
  conversations: Conversation[];
  selectedConversation: string | null;
  typing: boolean;
  thinking: boolean;
  streaming: boolean;
  voiceEnabled: boolean;
  attachments: Attachment[];
  context: ConversationContext;
  quickActions: QuickAction[];
  suggestions: Suggestion[];
  ui: {
    searchQuery: string;
    sidebarOpen: boolean;
    contextPanelOpen: boolean;
    showSuggestions: boolean;
  };
}

export interface AssistantOverview {
  totalConversations: number;
  todayMessages: number;
  pinnedConversations: number;
  favoriteConversations: number;
  activeContexts: number;
}
