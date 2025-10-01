'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import ChatCreator from '../Chat/ChatCreator';
import ChatItem from '../Chat/ChatItem';
import type { Conversation } from '@/types';
import { useConversation } from '@/hooks/useConversations';

export default function ConversationPanel() {
  const {
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    setMessages,
  } = useConversation();
  const [showCreate, setShowCreate] = useState(false);

  const handleDelete = async (conv: Conversation) => {
    await fetch(`http://localhost:8000/api/conversations/${conv.id}/`, {
      method: 'DELETE',
    });
    setConversations((prev) => prev.filter((c) => c.id !== conv.id));

    if (selectedConversation?.id == conv.id) {
      setSelectedConversation(null);
      setMessages([]);
    }
  };

  const handleEdit = async (conv: Conversation) => {
    const newTitle = prompt('New conversation name', conv.title);
    if (!newTitle) return;

    const res = await fetch(
      `http://localhost:8000/api/conversations/${conv.id}/`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      },
    );
    const updated = await res.json();

    setConversations((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex gap-2">
        <Button onClick={() => setShowCreate((prev) => !prev)}>
          <Plus className="w-4 h-4 mr-1" /> New Chat
        </Button>
      </div>

      {showCreate && <ChatCreator />}

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2">
          {conversations.map((conv) => (
            <ChatItem
              key={conv.id}
              conversation={conv}
              onSelect={setSelectedConversation}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
