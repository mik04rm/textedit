'use client';

import { useState, useEffect } from 'react';
import { useProject } from '@/hooks/useProject';
import { Button } from '@/components/ui/button';
import Editor from '../Editor/Editor';
import { Input } from '../ui/input';

interface DocumentEditorProps {
  docId: number;
}

export default function DocumentEditor({ docId }: DocumentEditorProps) {
  const { projectDocs, setProjectDocs } = useProject();
  const doc = projectDocs.find((d) => d.id === docId);

  const [title, setTitle] = useState(doc?.title || '');
  const [content, setContent] = useState(doc?.content || '');

  useEffect(() => {
    if (doc) {
      setTitle(doc.title);
      setContent(doc.content);
    }
  }, [doc]);

  const saveDoc = async () => {
    if (!doc) return;

    const updatedDoc = { ...doc, title, content };

    await fetch(`http://127.0.0.1:8000/api/documents/${doc.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDoc),
    });

    setProjectDocs((prev) =>
      prev.map((d) => (d.id === doc.id ? updatedDoc : d)),
    );
  };

  if (!doc) return <p>Dokument does not exists.</p>;

  return (
    <div className="flex flex-col h-full">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      <Editor content={content} onChange={setContent} />
      <Button onClick={saveDoc} className="mt-2">
        Zapisz
      </Button>
    </div>
  );
}
