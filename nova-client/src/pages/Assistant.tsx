"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "../components/layout/AppShell";
import { PageContainer } from "../components/layout/PageContainer";
import { PageSection } from "../components/layout/PageSection";
import { PremiumCard } from "../components/cards/PremiumCard";
import { RootState, AppDispatch } from "../store/store";
import {
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
} from "../redux/assistantSlice";
import { AssistantHeader } from "../components/assistant/AssistantHeader";
import { ConversationView } from "../components/assistant/ConversationView";
import { ConversationSidebar } from "../components/assistant/ConversationSidebar";
import { InputBar } from "../components/assistant/InputBar";
import { QuickActions } from "../components/assistant/QuickActions";
import { ConversationEmpty } from "../components/assistant/ConversationEmpty";
import { ContextPanel } from "../components/assistant/ContextPanel";
import { getMockResponse } from "../mock/assistantResponses";
import { mockSuggestions } from "../mock/assistantSuggestions";
import { mockQuickActions } from "../mock/assistantActions";
import { Conversation, Message, Attachment } from "../types/assistant.types";

export function Assistant() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    loading,
    messages,
    conversations,
    selectedConversation,
    typing,
    thinking,
    streaming,
    voiceEnabled,
    attachments,
    context,
    quickActions,
    suggestions,
    ui,
  } = useSelector((state: RootState) => state.assistant);

  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(setQuickActions(mockQuickActions));
    dispatch(setSuggestions(mockSuggestions));

    if (conversations.length === 0) {
      dispatch(createConversation({ title: "New Conversation" }));
    } else if (!selectedConversation) {
      dispatch(selectConversation(conversations[0].id));
    }

    dispatch(
      setContext({
        tasks: ["Complete Nova architecture", "Review pull requests", "Update documentation"],
        goals: ["Launch Nova MVP", "Reach 1000 users"],
        notes: ["Nova Architecture", "Business Planning", "Weekly Planning"],
        documents: ["Project Roadmap", "API Reference"],
        calendarEvents: ["Team Standup", "Code Review"],
      })
    );
  }, [dispatch, conversations.length, selectedConversation]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedConversation) return;

    dispatch(
      sendMessage({
        content: inputValue,
        conversationId: selectedConversation,
      })
    );

    setInputValue("");

    setTimeout(() => {
      dispatch(startThinking());
    }, 500);

    setTimeout(() => {
      dispatch(stopThinking());
      dispatch(startTyping());

      const response = getMockResponse(inputValue);
      dispatch(
        receiveMessage({
          content: response,
          conversationId: selectedConversation,
        })
      );
    }, 1500);

    setTimeout(() => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        dispatch(stopStreaming(lastMessage.id));
      }
      dispatch(stopTyping());
    }, 3000);
  };

  const handleNewChat = () => {
    dispatch(createConversation({ title: "New Conversation" }));
  };

  const handleVoiceToggle = () => {
    dispatch(toggleVoice());
    setIsRecording(!isRecording);
  };

  const handleSearch = () => {
    console.log("Search conversations");
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleActionClick = (action: string) => {
    setInputValue(action);
  };

  const handleAttachFile = () => {
    const newAttachment: Attachment = {
      id: `attach-${Date.now()}`,
      name: "example.pdf",
      type: "pdf",
      size: 1024000,
      url: "#",
    };
    dispatch(attachFile(newAttachment));
  };

  const handleRemoveAttachment = (id: string) => {
    dispatch(removeAttachment(id));
  };

  const handleMessageAction = (messageId: string, action: string) => {
    switch (action) {
      case "copy":
        const message = messages.find((m: Message) => m.id === messageId);
        if (message) {
          navigator.clipboard.writeText(message.content);
        }
        break;
      case "like":
        dispatch(setMessageReaction({ messageId, reaction: "like" }));
        break;
      case "dislike":
        dispatch(setMessageReaction({ messageId, reaction: "dislike" }));
        break;
      case "edit":
        const msgToEdit = messages.find((m: Message) => m.id === messageId);
        if (msgToEdit) {
          const newContent = prompt("Edit message:", msgToEdit.content);
          if (newContent) {
            dispatch(editMessage({ messageId, content: newContent }));
          }
        }
        break;
      case "regenerate":
        dispatch(regenerateResponse(messageId));
        setTimeout(() => {
          dispatch(startThinking());
        }, 500);
        setTimeout(() => {
          dispatch(stopThinking());
          dispatch(startTyping());
          const response = getMockResponse("regenerated response");
          dispatch(
            receiveMessage({
              content: response,
              conversationId: selectedConversation || "",
            })
          );
        }, 1500);
        setTimeout(() => {
          dispatch(stopTyping());
        }, 3000);
        break;
      case "delete":
        dispatch(deleteMessage(messageId));
        break;
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <AppShell pageTitle="Nova AI" activeRoute="assistant" onNavigate={() => {}}>
      <PageContainer>
        <PageSection className="h-[calc(100vh-100px)] min-h-[400px]">
          <div className="flex flex-col lg:flex-row gap-4 h-full">
            <ConversationSidebar
              conversations={conversations}
              selectedConversation={selectedConversation}
              searchQuery={ui.searchQuery}
              onSearchChange={(query) => dispatch(setSearchQuery(query))}
              onSelectConversation={(id) => dispatch(selectConversation(id))}
              onNewConversation={handleNewChat}
              onDeleteConversation={(id) => dispatch(deleteConversation(id))}
              onRenameConversation={(id, title) => dispatch(renameConversation({ id, title }))}
              onTogglePin={(id) => dispatch(togglePinConversation(id))}
              onToggleFavorite={(id) => dispatch(toggleFavoriteConversation(id))}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <div className="mb-4 flex-shrink-0">
                <AssistantHeader
                  onNewChat={handleNewChat}
                  onVoiceToggle={handleVoiceToggle}
                  onSearch={handleSearch}
                  voiceEnabled={voiceEnabled}
                  onToggleSidebar={handleToggleSidebar}
                />
              </div>

              <div className="flex-1 overflow-hidden min-h-0">
                <div className="h-full overflow-y-auto px-1">
                  {!hasMessages ? (
                    <>
                      <ConversationEmpty
                        suggestions={suggestions}
                        onSuggestionClick={handleSuggestionClick}
                        onNewChat={handleNewChat}
                      />

                      {ui.showSuggestions && (
                        <div className="mt-6 mb-4">
                          <QuickActions actions={quickActions} onActionClick={handleActionClick} />
                        </div>
                      )}

                      {ui.showSuggestions && (
                        <div className="mb-4">
                          <PromptSuggestions suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />
                        </div>
                      )}
                    </>
                  ) : (
                    <ConversationView
                      messages={messages}
                      typing={typing}
                      thinking={thinking}
                      onMessageAction={handleMessageAction}
                    />
                  )}
                </div>
              </div>

              <div className="mt-4 flex-shrink-0">
                <InputBar
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSendMessage}
                  onAttach={handleAttachFile}
                  attachments={attachments}
                  onRemoveAttachment={handleRemoveAttachment}
                  disabled={typing || thinking}
                />
              </div>

              {ui.contextPanelOpen && (
                <ContextPanel
                  context={context}
                  onClose={() => dispatch(toggleContextPanel())}
                />
              )}
            </div>
          </div>
        </PageSection>
      </PageContainer>
    </AppShell>
  );
}

import { PromptSuggestions } from "../components/assistant/PromptSuggestions";
