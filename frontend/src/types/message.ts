export interface Message {
  id: number;
  content: string;
  role: 'user' | 'bot';
  created_at?: string;
}
