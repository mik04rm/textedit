import { DocumentProvider } from '@/stores/DocumentContext';
import { ConversationProvider } from '@/stores/ConversationContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DocumentProvider>
          <ConversationProvider>{children}</ConversationProvider>
        </DocumentProvider>
      </body>
    </html>
  );
}
