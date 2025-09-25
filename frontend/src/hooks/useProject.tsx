'use client';

import { useContext } from 'react';
import { ProjectContext } from '@/stores/ProjectContext';

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context)
    throw new Error('useProject must be used within ProjectProvider');

  return context;
};
