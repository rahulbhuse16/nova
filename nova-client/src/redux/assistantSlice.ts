import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AssistantState,
  Message,
  Conversation,
  Attachment,
  QuickAction,
  Suggestion,
  ConversationContext,
} from "../types/assistant.types";

const initialState: AssistantState = {
  loading: false,
  messages: [],
  conversations: [],
  selectedConversation: null,
  typing: false,
  thinking: false,
  streaming: false,
  voiceEnabled: false,
  attachments: [],
  context: {},
  quickActions: [],
  suggestions: [],
  ui: {
    searchQuery: "",
    sidebarOpen: true,
    contextPanelOpen: false,
    showSuggestions: true,
  },
};

const assistantSlice = createSlice({
  name: "assistant",
  initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<{ content: string; conversationId: string }>) => {
      const { content, conversationId } = action.payload;
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        type: "user",
        content,
        timestamp: new Date().toISOString(),
        conversationId,
      };
      state.messages.push(userMessage);
      state.typing = true;
      state.thinking = true;
    },

    receiveMessage: (state, action: PayloadAction<{ content: string; conversationId: string }>) => {
      const { content, conversationId } = action.payload;
      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        type: "assistant",
        content,
        timestamp: new Date().toISOString(),
        conversationId,
        isStreaming: true,
      };
      state.messages.push(assistantMessage);
      state.typing = false;
      state.thinking = false;
      state.streaming = true;
    },

    stopStreaming: (state, action: PayloadAction<string>) => {
      const messageId = action.payload;
      const message = state.messages.find((m) => m.id === messageId);
      if (message) {
        message.isStreaming = false;
      }
      state.streaming = false;
    },

    startTyping: (state) => {
      state.typing = true;
    },

    stopTyping: (state) => {
      state.typing = false;
    },

    startThinking: (state) => {
      state.thinking = true;
    },

    stopThinking: (state) => {
      state.thinking = false;
    },

    createConversation: (state, action: PayloadAction<{ title: string }>) => {
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        title: action.payload.title,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
        isFavorite: false,
      };
      state.conversations.unshift(newConversation);
      state.selectedConversation = newConversation.id;
    },

    deleteConversation: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.conversations = state.conversations.filter((c) => c.id !== id);
      if (state.selectedConversation === id) {
        state.selectedConversation = state.conversations.length > 0 ? state.conversations[0].id : null;
      }
    },

    renameConversation: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const { id, title } = action.payload;
      const conversation = state.conversations.find((c) => c.id === id);
      if (conversation) {
        conversation.title = title;
        conversation.updatedAt = new Date().toISOString();
      }
    },

    clearConversation: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const conversation = state.conversations.find((c) => c.id === id);
      if (conversation) {
        conversation.messages = [];
        conversation.updatedAt = new Date().toISOString();
      }
      if (state.selectedConversation === id) {
        state.messages = [];
      }
    },

    selectConversation: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.selectedConversation = id;
      const conversation = state.conversations.find((c) => c.id === id);
      if (conversation) {
        state.messages = conversation.messages;
        state.context = conversation.context || {};
      }
    },

    togglePinConversation: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const conversation = state.conversations.find((c) => c.id === id);
      if (conversation) {
        conversation.isPinned = !conversation.isPinned;
        conversation.updatedAt = new Date().toISOString();
      }
    },

    toggleFavoriteConversation: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const conversation = state.conversations.find((c) => c.id === id);
      if (conversation) {
        conversation.isFavorite = !conversation.isFavorite;
        conversation.updatedAt = new Date().toISOString();
      }
    },

    toggleVoice: (state) => {
      state.voiceEnabled = !state.voiceEnabled;
    },

    attachFile: (state, action: PayloadAction<Attachment>) => {
      state.attachments.push(action.payload);
    },

    removeAttachment: (state, action: PayloadAction<string>) => {
      state.attachments = state.attachments.filter((a) => a.id !== action.payload);
    },

    clearAttachments: (state) => {
      state.attachments = [];
    },

    setContext: (state, action: PayloadAction<ConversationContext>) => {
      state.context = action.payload;
      const conversation = state.conversations.find((c) => c.id === state.selectedConversation);
      if (conversation) {
        conversation.context = action.payload;
      }
    },

    setQuickActions: (state, action: PayloadAction<QuickAction[]>) => {
      state.quickActions = action.payload;
    },

    setSuggestions: (state, action: PayloadAction<Suggestion[]>) => {
      state.suggestions = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.ui.searchQuery = action.payload;
    },

    toggleSidebar: (state) => {
      state.ui.sidebarOpen = !state.ui.sidebarOpen;
    },

    toggleContextPanel: (state) => {
      state.ui.contextPanelOpen = !state.ui.contextPanelOpen;
    },

    toggleSuggestions: (state) => {
      state.ui.showSuggestions = !state.ui.showSuggestions;
    },

    setMessageReaction: (state, action: PayloadAction<{ messageId: string; reaction: "like" | "dislike" | null }>) => {
      const { messageId, reaction } = action.payload;
      const message = state.messages.find((m) => m.id === messageId);
      if (message) {
        message.reaction = reaction;
      }
    },

    editMessage: (state, action: PayloadAction<{ messageId: string; content: string }>) => {
      const { messageId, content } = action.payload;
      const message = state.messages.find((m) => m.id === messageId);
      if (message) {
        message.content = content;
        message.isEdited = true;
      }
    },

    deleteMessage: (state, action: PayloadAction<string>) => {
      const messageId = action.payload;
      state.messages = state.messages.filter((m) => m.id !== messageId);
    },

    regenerateResponse: (state, action: PayloadAction<string>) => {
      const messageId = action.payload;
      const messageIndex = state.messages.findIndex((m) => m.id === messageId);
      if (messageIndex !== -1) {
        state.messages = state.messages.slice(0, messageIndex);
        state.thinking = true;
      }
    },
  },
});

export const {
  sendMessage,
  receiveMessage,
  stopStreaming,
  startTyping,
  stopTyping,
  startThinking,
  stopThinking,
  createConversation,
  deleteConversation,
  renameConversation,
  clearConversation,
  selectConversation,
  togglePinConversation,
  toggleFavoriteConversation,
  toggleVoice,
  attachFile,
  removeAttachment,
  clearAttachments,
  setContext,
  setQuickActions,
  setSuggestions,
  setSearchQuery,
  toggleSidebar,
  toggleContextPanel,
  toggleSuggestions,
  setMessageReaction,
  editMessage,
  deleteMessage,
  regenerateResponse,
} = assistantSlice.actions;

export default assistantSlice.reducer;
