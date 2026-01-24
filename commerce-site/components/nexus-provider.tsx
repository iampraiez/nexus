'use client';

import { useEffect } from 'react';
import { Nexus } from 'nexus-avail';

export function NexusProvider({ children }: { children: React.ReactNode }) {
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

  return <>{children}</>;
}
