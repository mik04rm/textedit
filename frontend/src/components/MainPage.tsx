'use client';

import Chat from './Chat/Chat';
import DocumentPanel from './Documents/DocumentPanel';
import ToolsPanel from './Tools/ToolsPanel';
import { useDocuments } from '@/hooks/useDocuments';

export default function MainPage() {
  const { isDocPanelOpen } = useDocuments();

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="h-16 bg-gray-200 flex items-center px-4">
        <span className="font-semibold">Menu</span>
      </div>

      <div className="flex flex-1 h-full transition-all duration-300">
        <div
          className={`p-2 flex h-full flex-col transition-all duration-300 ${
            isDocPanelOpen ? 'w-1/3' : 'w-1/4'
          }`}
        >
          <DocumentPanel />
        </div>

        <div className="p-2 w-1/2 flex flex-col h-full">
          <Chat />
        </div>

        <div className="p-2 w-1/4 flex flex-col h-full">
          <ToolsPanel />
        </div>
      </div>
    </div>
  );
}
