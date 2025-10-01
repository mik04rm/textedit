'use client';

import { useContext } from 'react';
import { DocumentContext } from '@/stores/DocumentContext';

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context)
    throw new Error('useDocuments must be used within ProjectProvider');

  return context;
};
