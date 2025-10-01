'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import ConversationPanel from './ConversationPanel';

export default function ToolsPanel() {
  const [view, setView] = useState<'main' | 'conversations'>('main');

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex justify-between items-center border-b">
        <CardTitle>Tools</CardTitle>
        <div className="w-6 h-6">
          {view === 'conversations' && (
            <Button size="sm" variant="ghost" onClick={() => setView('main')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 h-full">
        {view === 'main' ? (
          <div className="flex flex-col gap-2">
            <Button onClick={() => setView('conversations')}>
              Conversations
            </Button>

            {/* Tools */}
          </div>
        ) : (
          <ConversationPanel />
        )}
      </CardContent>
    </Card>
  );
}
