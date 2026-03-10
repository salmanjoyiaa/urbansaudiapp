import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchVisitsByDate, updateVisitStatus, bulkAssignVisits, fetchVisitingAgents, sendDaySummary } from '@/services/visits';
import type { VisitStatus } from '@/types';

export function useVisitsByDate(date: string, statusFilter?: VisitStatus | null) {
  return useQuery({
    queryKey: ['visits', date, statusFilter || 'all'],
    queryFn: () => fetchVisitsByDate(date, statusFilter || undefined),
    staleTime: 10_000,
    enabled: !!date,
  });
}

export function useVisitingAgents() {
  return useQuery({
    queryKey: ['visiting-agents'],
    queryFn: fetchVisitingAgents,
    staleTime: 5 * 60_000, // 5 minutes
  });
}

export function useUpdateVisitStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      visitId: string;
      status: 'assigned' | 'confirmed' | 'cancelled' | 'completed';
      visiting_agent_id?: string;
      admin_notes?: string;
    }) => updateVisitStatus(params.visitId, params.status, {
      visiting_agent_id: params.visiting_agent_id,
      admin_notes: params.admin_notes,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}

export function useBulkAssign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { date: string; visiting_agent_id: string }) =>
      bulkAssignVisits(params.date, params.visiting_agent_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}

export function useSendDaySummary() {
  return useMutation({
    mutationFn: (params: {
      date: string;
      recipientType: 'visiting_agent' | 'property_agent';
      agentId: string;
      options?: { preview?: boolean; emailOnly?: boolean };
    }) => sendDaySummary(params.date, params.recipientType, params.agentId, params.options),
  });
}
