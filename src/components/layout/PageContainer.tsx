import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-6 md:py-8">
        {children}
      </div>
    </main>
  );
}
