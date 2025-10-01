'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';
import type { Conversation, Message } from '@/types';

type ConversationContextType = {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  selectedConversation: Conversation | null;
  setSelectedConversation: (conv: Conversation | null) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  createConversation: (title: string) => Promise<Conversation>;
};

export const ConversationContext = createContext<
  ConversationContextType | undefined
>(undefined);

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const createConversation = async (title: string) => {
    const res = await fetch('http://localhost:8000/api/conversations/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) throw new Error('Failed to create conversation.');

    const conv = await res.json();
    setConversations((prev) => [...prev, conv]);
    setSelectedConversation(conv);

    return conv;
  };

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await fetch('http://127.0.0.1:8000/api/conversations/');
      const data = await res.json();
      setConversations(data);
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      const res = await fetch(
        `http://127.0.0.1:8000/api/conversations/${selectedConversation.id}/`,
      );
      const data = await res.json();
      setMessages(data.messages || []);
    };
    fetchMessages();
  }, [selectedConversation]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        setConversations,
        selectedConversation,
        setSelectedConversation,
        messages,
        setMessages,
        createConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
