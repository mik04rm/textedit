'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import type { Conversation } from '@/types';

export default function ChatCreator({
  onCreate,
}: {
  onCreate: (conv: Conversation) => void;
}) {
  const [title, setTitle] = useState('');

  const createConversation = async () => {
    if (!title.trim()) return;

    const res = await fetch('http://localhost:8000/api/conversations/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    if (res.ok) {
      const conv = await res.json();
      onCreate(conv);
      setTitle('');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Conversation</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Conversation title"
        />
        <Button onClick={createConversation}>Create</Button>
      </CardContent>
    </Card>
  );
}
