'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useProject } from '@/hooks/useProject';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Conversation, Message } from '@/types';

interface ChatProps {
  conversation: Conversation | null;
}

export default function Chat({ conversation }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const { projectDocs } = useProject();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversation) return;

      const res = await fetch(
        `http://localhost:8000/api/conversations/${conversation.id}`,
      );
      const data = await res.json();
      setMessages(data.messages || []);
    };

    fetchMessages();
  }, [conversation]);

  const sendMessage = async () => {
    if (!input.trim() || !conversation) return;

    const resUser = await fetch(
      `http://localhost:8000/api/conversations/${conversation.id}/add_message/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: input }),
      },
    );

    const userMsg: Message = await resUser.json();
    setMessages((prev) => [...prev, userMsg]);

    // const resBot = await fetch('http://localhost:8000/ask', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     question: input,
    //     doc_ids: projectDocs.map((doc) => doc.id),
    //     conversation_id: conversation.id,
    //   }),
    // });

    // const data = await resBot.json();

    // const resBotMsg = await fetch(
    //   `http://localhost:8000/conversation/${conversation.id}/messages`,
    //   {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ role: 'bot', content: data.answer }),
    //   },
    // );

    // const botMsg: Message = await resBotMsg.json();
    // setMessages((prev) => [...prev, botMsg]);

    setInput('');
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b">
        <CardTitle>Chat</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 break-words whitespace-pre-wrap ${
                msg.role === 'user' ? 'text-blue-600' : 'text-green-600'
              }`}
            >
              <b>{msg.role}:</b> {msg.content}
            </div>
          ))}
        </div>

        <div className="relative w-full">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write message..."
            className="resize-none pr-12"
          />
          <Button
            onClick={sendMessage}
            className="absolute right-2 top-1/2 -translate-y-1/2"
            size="sm"
          >
            <ArrowUp size={20} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
