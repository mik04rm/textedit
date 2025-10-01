'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import type { Conversation } from '@/types';
import { Trash, SquarePen } from 'lucide-react';

interface Props {
  conversation: Conversation;
  onSelect: (conv: Conversation) => void;
  onEdit: (conv: Conversation) => void;
  onDelete: (conv: Conversation) => void;
}

export default function ChatItem({
  conversation,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        className="justify-start flex-1"
        onClick={() => onSelect(conversation)}
      >
        {conversation.title}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1 ml-2">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onEdit(conversation)}>
            <SquarePen /> Change name
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(conversation)}>
            <Trash /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
