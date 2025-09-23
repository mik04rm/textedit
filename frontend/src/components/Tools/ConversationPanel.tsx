'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import ChatCreator from '../Chat/ChatCreator';
import ChatItem from '../Chat/ChatItem';

interface Conversation {
  id: number;
  title: string;
}

interface ConversationPanelProps {
  onSelectConversation: (conv: Conversation) => void;
  onCreateConversation: (conv: Conversation) => void;
}

export default function ConversationPanel({
  onSelectConversation,
  onCreateConversation,
}: ConversationPanelProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await fetch('http://localhost:8000/api/conversations/');
      const data = await res.json();
      if (Array.isArray(data)) setConversations(data);
    };
    fetchConversations();
  }, []);

  const handleCreate = (conv: Conversation) => {
    setConversations((prev) => [...prev, conv]);
    onCreateConversation(conv);
    setShowCreate(false);
  };

  const handleDelete = async (conv: Conversation) => {
    await fetch(`http://localhost:8000/api/conversations/${conv.id}/`, {
      method: 'DELETE',
    });
    setConversations((prev) => prev.filter((c) => c.id !== conv.id));
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

      {showCreate && <ChatCreator onCreate={handleCreate} />}

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2">
          {conversations.map((conv) => (
            <ChatItem
              key={conv.id}
              conversation={conv}
              onSelect={onSelectConversation}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
