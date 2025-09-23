'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useProject } from '@/stores/ProjectContext';
import { useState } from 'react';

type FileUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function FileUploadModal({
  isOpen,
  onClose,
}: FileUploadModalProps) {
  const { projectDocs, setProjectDocs } = useProject();
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    const text = await file.text();
    const title = file.name.replace('.txt', '');

    const res = await fetch('http://127.0.0.1:8000/api/documents/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content: text }),
    });

    const data = await res.json();
    setProjectDocs([...projectDocs, data]);
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add file</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 items-center mt-2">
          <Input
            type="file"
            className="hidden"
            id="file-input"
            accept=".txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="file-input">
            <Button asChild>
              <span>Choose a file</span>
            </Button>
          </label>
          <span className="text-sm">{file?.name}</span>
        </div>

        <DialogFooter className="mt-4 flex gap-2">
          <Button onClick={handleUpload} disabled={!file}>
            Add
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
