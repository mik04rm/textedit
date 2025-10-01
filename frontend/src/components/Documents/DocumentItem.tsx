import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Download, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import type { Document } from '@/types';

interface Props {
  doc: Document;
  onSelect: (doc: Document) => void;
  onDelete: (doc: Document) => void;
}

export default function DocumentItem({ doc, onSelect, onDelete }: Props) {
  // For now, change it later (make it better)
  // Now we change "br" and "p"
  const handleDownload = () => {
    const temp = document.createElement('div');
    temp.innerHTML = doc.content || '';

    temp.querySelectorAll('br').forEach((el) => el.replaceWith('\n'));

    temp.querySelectorAll('p, div').forEach((el) => {
      const text = el.textContent?.trim() || '';
      el.replaceWith(`\n${text}\n`);
    });

    const text = temp.innerText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join('\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex justify-between items-center">
      <Button
        key={doc.id}
        variant="outline"
        className="justify-start flex-1"
        onClick={() => onSelect(doc)}
      >
        {doc.title}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1 ml-2">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onDelete(doc)}>
            <Trash /> Delete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <Download /> Download
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
