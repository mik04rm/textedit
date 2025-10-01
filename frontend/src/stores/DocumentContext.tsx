'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';
import type { Document } from '@/types';

type DocumentContextType = {
  projectDocs: Document[];
  setProjectDocs: React.Dispatch<React.SetStateAction<Document[]>>;
  selectedDoc: Document | null;
  setSelectedDoc: React.Dispatch<React.SetStateAction<Document | null>>;
  isDocPanelOpen: boolean;
  openDoc: (doc: Document) => void;
  closeDoc: () => void;
  selectedDocs: Document[];
  toggleDocSelection: (doc: Document) => void;
};

export const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined,
);

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [projectDocs, setProjectDocs] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isDocPanelOpen, setIsDocPanelOpen] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<Document[]>([]);

  const openDoc = (doc: Document) => {
    setSelectedDoc(doc);
    setIsDocPanelOpen(true);
  };

  const closeDoc = () => {
    setSelectedDoc(null);
    setIsDocPanelOpen(false);
  };

  const toggleDocSelection = (doc: Document) => {
    setSelectedDocs((prev) =>
      prev.some((d) => d.id === doc.id)
        ? prev.filter((d) => d.id !== doc.id)
        : [...prev, doc],
    );
  };

  useEffect(() => {
    const fetchDocs = async () => {
      const res = await fetch('http://127.0.0.1:8000/api/documents/');
      const data = await res.json();
      setProjectDocs(data);
    };
    fetchDocs();
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        projectDocs,
        setProjectDocs,
        selectedDoc,
        setSelectedDoc,
        isDocPanelOpen,
        openDoc,
        closeDoc,
        selectedDocs,
        toggleDocSelection,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
