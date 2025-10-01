import { DocumentProvider } from '@/stores/DocumentContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DocumentProvider>{children}</DocumentProvider>
      </body>
    </html>
  );
}
