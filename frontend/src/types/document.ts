type HighlightRange = {
  start: number;
  end: number;
};

export interface Document {
  id: number;
  title: string;
  content: string;
  isEditing?: boolean;
  highlightRange?: HighlightRange;
}
