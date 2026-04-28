import type {Metadata} from 'next';
import './globals.css'; // Global styles
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'My Google AI Studio App',
  description: 'My Google AI Studio App',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ProtectedRoute>
          <Layout>
            {children}
          </Layout>
        </ProtectedRoute>
      </body>
    </html>
  );
}
