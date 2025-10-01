'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useConversation } from '@/hooks/useConversations';

export default function ChatCreator() {
  const [title, setTitle] = useState('');
  const { createConversation } = useConversation();

  const handleCreate = async () => {
    if (!title.trim()) return;

    try {
      await createConversation(title);
      setTitle('');
    } catch (err) {
      console.error(err);
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
        <Button onClick={handleCreate}>Create</Button>
      </CardContent>
    </Card>
  );
}
