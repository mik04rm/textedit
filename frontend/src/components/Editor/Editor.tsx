'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    autofocus: true,
    editable: true,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'focus:outline-none min-h-[200px]' },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="mt-2 border rounded-md p-2 pr-4 flex-1 overflow-y-auto">
      <EditorContent editor={editor} />
    </div>
  );
}
