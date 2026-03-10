import { useQuery } from '@tanstack/react-query';
import { fetchDashboardCounts, fetchRecentActivity } from '@/services/dashboard';

export function useDashboardCounts() {
  return useQuery({
    queryKey: ['dashboard-counts'],
    queryFn: fetchDashboardCounts,
    staleTime: 30_000,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: fetchRecentActivity,
    staleTime: 30_000,
  });
}
