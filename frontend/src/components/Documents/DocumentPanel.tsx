'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProject } from '@/hooks/useProject';
import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import DocumentItem from './DocumentItem';
import FileUploadModal from './FileUploadModal';
import DocumentEditor from './DocumentEditor';
import type { Document } from '@/types';

export default function DocumentPanel({
  onOpenChange,
}: {
  onOpenChange: (isOpen: boolean) => void;
}) {
  const { projectDocs, setProjectDocs } = useProject();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const openDoc = (doc: Document) => {
    setSelectedDoc(doc);
    onOpenChange(true);
  };

  const closeDoc = () => {
    setSelectedDoc(null);
    onOpenChange(false);
  };

  const handleDelete = async (doc: Document) => {
    await fetch(`http://localhost:8000/api/documents/${doc.id}/`, {
      method: 'DELETE',
    });
    setProjectDocs(projectDocs.filter((d) => d.id !== doc.id));

    if (selectedDoc?.id === doc.id) {
      closeDoc();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex justify-between items-center border-b">
        <CardTitle>Documents</CardTitle>

        <div className="w-6 h-6">
          {selectedDoc && (
            <Button size="sm" variant="ghost" onClick={closeDoc}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden min-h-0">
        {!selectedDoc ? (
          <>
            <div className="flex gap-2">
              <Button onClick={() => setIsFileModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add a file
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-2">
                {projectDocs.map((doc) => (
                  <DocumentItem
                    key={doc.id}
                    document={doc}
                    onSelect={openDoc}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </ScrollArea>
          </>
        ) : (
          <DocumentEditor docId={selectedDoc.id} />
        )}
      </CardContent>

      <FileUploadModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
      />
    </Card>
  );
}
