'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useDocuments } from '@/hooks/useDocuments';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Conversation, Message } from '@/types';

interface ChatProps {
  conversation: Conversation | null;
}

export default function Chat({ conversation }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const { selectedDocs, openDoc } = useDocuments();

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

    console.log(
      'Selected doc IDs being sent:',
      selectedDocs.map((doc) => doc.id),
    );

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

    const resBot = await fetch('http://localhost:8000/api/ask/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: input,
        doc_ids: selectedDocs.map((doc) => doc.id),
        conversation_id: conversation.id,
      }),
    });

    const data = await resBot.json();

    const resBotMsg = await fetch(
      `http://localhost:8000/api/conversations/${conversation.id}/add_message/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'bot',
          content: data.answer,
          sources: data.sources,
        }),
      },
    );

    const botMsg: Message = await resBotMsg.json();
    setMessages((prev) => [...prev, { ...botMsg, sources: data.sources }]);

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
              {msg.role === 'bot' && msg.sources && msg.sources.length > 0 && (
                <div className="mt-1 text-sm text-gray-500">
                  Sources:
                  {msg.sources.map((src, idx) => (
                    <div
                      key={idx}
                      className="ml-4 cursor-pointer text-blue-500 hover:underline"
                      onClick={() => {
                        const doc = selectedDocs.find(
                          (d) => d.id === src.document_id,
                        );
                        if (doc) {
                          openDoc({
                            ...doc,
                            highlightRange: {
                              start: src.start_pos,
                              end: src.end_pos,
                            },
                          });
                        }
                      }}
                    >
                      {src.document_title}: chunk {src.chunk_index} (
                      {src.start_pos}-{src.end_pos})
                    </div>
                  ))}
                </div>
              )}
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
