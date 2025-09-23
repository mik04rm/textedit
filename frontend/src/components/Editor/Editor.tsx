'use client';

import { Button } from '@/components/ui/button';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';

export default function EditorBlock({ docId }: { docId: number }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    autofocus: true,
    editable: true,
    injectCSS: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
  });

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      const res = await fetch(`http://127.0.0.1:8000/documents/${docId}`);
      const data = await res.json();
      setTitle(data.title);
      editor?.commands.setContent(data.content || '');
      setLoading(false);
    };
    if (editor) fetchDoc();
  }, [docId, editor]);

  const saveDoc = async () => {
    if (!editor) return;
    const content = editor.getHTML();

    await fetch(`http://127.0.0.1:8000/documents/${docId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    alert('Dokument zapisany');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="flex-1 overflow-y-auto border rounded p-2">
        <EditorContent editor={editor} />
      </div>
      <Button onClick={saveDoc} className="mt-2">
        Zapisz
      </Button>
    </div>
  );
}
