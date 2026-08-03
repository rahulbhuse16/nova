"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import { Message } from "../../types/assistant.types";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ThinkingAnimation } from "./ThinkingAnimation";

interface ConversationViewProps {
  messages: Message[];
  typing: boolean;
  thinking: boolean;
  onMessageAction?: (messageId: string, action: string) => void;
}

export function ConversationView({
  messages,
  typing,
  thinking,
  onMessageAction,
}: ConversationViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, thinking]);

  return (
    <div className="flex-1 overflow-y-auto space-y-6 p-6">
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
          >
            <MessageBubble
              message={message}
              onAction={(action: string) => onMessageAction?.(message.id, action)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {thinking && <ThinkingAnimation />}
      {typing && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
}
