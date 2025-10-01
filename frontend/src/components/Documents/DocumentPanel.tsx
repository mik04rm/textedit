'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDocuments } from '@/hooks/useDocuments';
import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import DocumentItem from './DocumentItem';
import FileUploadModal from './FileUploadModal';
import DocumentEditor from './DocumentEditor';
import type { Document } from '@/types';
import { HighlightedText } from './HighlightedText';
import { Checkbox } from '../ui/checkbox';

export default function DocumentPanel() {
  const {
    projectDocs,
    setProjectDocs,
    selectedDoc,
    setSelectedDoc,
    openDoc,
    closeDoc,
    selectedDocs,
    toggleDocSelection,
  } = useDocuments();

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

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
              {projectDocs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`doc-${doc.id}`}
                    checked={selectedDocs.some((d) => d.id === doc.id)}
                    onCheckedChange={() => toggleDocSelection(doc)}
                  />
                  <div className="flex-1">
                    <DocumentItem
                      doc={doc}
                      onSelect={openDoc}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>
              ))}
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-col h-full">
            {!selectedDoc.isEditing ? (
              <ScrollArea className="p-2 flex-1 overflow-y-auto">
                <Button
                  className="mt-2"
                  onClick={() =>
                    setSelectedDoc({ ...selectedDoc, isEditing: true })
                  }
                >
                  Edit
                </Button>
                <h2 className="font-bold mb-2">{selectedDoc.title}</h2>
                {selectedDoc.highlightRange ? (
                  <HighlightedText
                    text={selectedDoc.content}
                    range={selectedDoc.highlightRange}
                  />
                ) : (
                  <p className="break-words whitespace-pre-wrap">
                    {selectedDoc.content}
                  </p>
                )}
              </ScrollArea>
            ) : (
              <DocumentEditor docId={selectedDoc.id} />
            )}
          </div>
        )}
      </CardContent>

      <FileUploadModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
      />
    </Card>
  );
}
