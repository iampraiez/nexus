'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Nexus } from 'nexus-avail';

export function NexusProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_NEXUS_API_KEY;
    const projectId = process.env.NEXT_PUBLIC_NEXUS_PROJECT_ID;
    const environment = (process.env.NEXT_PUBLIC_NEXUS_ENVIRONMENT as 'development' | 'production') || 'development';
    
    if (apiKey && projectId) {
      Nexus.init({ 
        apiKey, 
        projectId, 
        environment 
      });
      console.log('Nexus SDK initialized');
    } else {
      console.warn('Nexus API Key or Project ID missing. Analytics will not be tracked.');
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    Nexus.pageView();
  }, [pathname]);

  // Identify user when session changes
  useEffect(() => {
    if (session?.user?.id) {
      Nexus.identify(session.user.id);
    }
  }, [session]);

  return <>{children}</>;
}
