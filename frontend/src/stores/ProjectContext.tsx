'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Document = {
  id: number;
  title: string;
  content: string;
};

type ProjectContextType = {
  projectDocs: Document[];
  setProjectDocs: (docs: Document[]) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projectDocs, setProjectDocs] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocs = async () => {
      const res = await fetch('http://127.0.0.1:8000/documents/');
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

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context)
    throw new Error('useProject must be used within ProjectProvider');
  return context;
};
