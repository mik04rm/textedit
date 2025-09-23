'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';

interface Document {
  id: number;
  title: string;
  content: string;
}

interface Props {
  document: Document;
  onSelect: (doc: Document) => void;
  onDelete: (doc: Document) => void;
}

export default function DocumentItem({ document, onSelect, onDelete }: Props) {
  return (
    <div className="flex justify-between items-center">
      <Button
        key={document.id}
        variant="outline"
        className="justify-start flex-1"
        onClick={() => onSelect(document)}
      >
        {document.title}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1 ml-2">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onDelete(document)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
