'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';
import type { Document } from '@/types';

type ProjectContextType = {
  projectDocs: Document[];
  setProjectDocs: React.Dispatch<React.SetStateAction<Document[]>>;
};

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined,
);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projectDocs, setProjectDocs] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocs = async () => {
      const res = await fetch('http://127.0.0.1:8000/api/documents/');
      const data = await res.json();
      setProjectDocs(data);
    };
    fetchDocs();
  }, []);

  return (
    <ProjectContext.Provider value={{ projectDocs, setProjectDocs }}>
      {children}
    </ProjectContext.Provider>
  );
};
