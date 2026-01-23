'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardContextType {
  company: any;
  projects: any[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType>({
  company: null,
  projects: [],
  loading: true,
  refreshData: async () => {},
});

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      // Parallel fetch for core data
      const [sessionRes, projectsRes] = await Promise.all([
        fetch('/api/auth/session'),
        fetch('/api/projects')
      ]);

      const sessionData = await sessionRes.json();
      const projectsData = await projectsRes.json();

      if (sessionRes.status === 401 || !sessionData.success) {
        router.push('/auth/login');
        return;
      }

      if (sessionData.success) {
        setCompany(sessionData.data);
      }

      if (projectsData.success) {
        setProjects(projectsData.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardContext.Provider value={{ company, projects, loading, refreshData: fetchData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);
