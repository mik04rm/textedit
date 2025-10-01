export interface Message {
  id: number;
  content: string;
  role: 'user' | 'bot';
  created_at?: string;
  sources?: {
    document_id: number;
    document_title: string;
    chunk_index: number;
    start_pos: number;
    end_pos: number;
  }[];
}
