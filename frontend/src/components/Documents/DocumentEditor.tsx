import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import Chat from '../Chat/Chat';
import EditorBlock from '../Editor/Editor';

export default function DocumentEditor({
  selectedDocId,
}: {
  selectedDocId: number | null;
}) {
  if (!selectedDocId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Wybierz dokument z listy
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1 flex h-full">
      <ResizablePanel
        defaultSize={70}
        className="flex flex-col border-r p-4 h-full"
      >
        <EditorBlock docId={selectedDocId} />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={30} className="flex flex-col h-full p-4">
        <Chat />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
