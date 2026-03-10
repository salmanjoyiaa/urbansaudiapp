import { supabase } from './supabase';
import type { VisitWithDetails, VisitingAgentOption, VisitStatusCounts, VisitStatus } from '@/types';

const VISIT_SELECT = `
  id, visitor_name, visitor_email, visitor_phone, visit_date, visit_time,
  status, visiting_status, customer_remarks, admin_notes, visiting_agent_id,
  reschedule_reason, reschedule_date, reschedule_time,
  confirmed_by, confirmed_at, created_at, updated_at, property_id,
  visiting_agent:visiting_agent_id(id, full_name, phone),
  properties:property_id (
    id, title, property_ref, location_url, visiting_agent_instructions, visiting_agent_image,
    agents:agent_id (
      profiles:profile_id (full_name, phone)
    )
  )
`;

export async function fetchVisitsByDate(
  date: string,
  statusFilter?: VisitStatus
): Promise<{ visits: VisitWithDetails[]; counters: VisitStatusCounts }> {
  let query = supabase
    .from('visit_requests')
    .select(VISIT_SELECT)
    .eq('visit_date', date)
    .order('visit_time', { ascending: true });

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;
  if (error) throw error;

  const visits = (data || []) as unknown as VisitWithDetails[];

  // Compute counters from all visits for the date (unfiltered)
  const allVisits = statusFilter
    ? await supabase
        .from('visit_requests')
        .select('status')
        .eq('visit_date', date)
        .then(r => r.data || [])
    : visits;

  const counters: VisitStatusCounts = {
    pending: 0,
    assigned: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
  };

  for (const v of allVisits) {
    const s = (v as { status: string }).status as VisitStatus;
    if (s in counters) counters[s]++;
  }

  return { visits, counters };
}

export async function updateVisitStatus(
  visitId: string,
  status: 'assigned' | 'confirmed' | 'cancelled' | 'completed',
  options?: { visiting_agent_id?: string; admin_notes?: string }
) {
  // Use the web app's API route via Bearer token for notifications + audit logging
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (!token) throw new Error('Not authenticated');

  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const res = await fetch(`${baseUrl}/api/admin/visits/${visitId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      status,
      visiting_agent_id: options?.visiting_agent_id,
      admin_notes: options?.admin_notes,
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update visit');
  return json;
}

export async function bulkAssignVisits(date: string, visiting_agent_id: string) {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (!token) throw new Error('Not authenticated');

  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const res = await fetch(`${baseUrl}/api/admin/visits/bulk-assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ date, visiting_agent_id }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Bulk assign failed');
  return json as { assignedCount: number; conflictCount: number; conflicts: unknown[] };
}

export async function getPendingCountForDate(date: string): Promise<number> {
  const { count, error } = await supabase
    .from('visit_requests')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')
    .eq('visit_date', date);

  if (error) throw error;
  return count ?? 0;
}

export async function fetchVisitingAgents(): Promise<VisitingAgentOption[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('profile_id, profiles:profile_id(full_name)')
    .eq('agent_type', 'visiting')
    .eq('status', 'approved');

  if (error) throw error;

  return (data || []).map((a: Record<string, unknown>) => ({
    id: a.profile_id as string,
    name: ((a.profiles as Record<string, unknown>)?.full_name as string) || 'Unknown',
  }));
}

export async function sendDaySummary(
  date: string,
  recipientType: 'visiting_agent' | 'property_agent',
  agentId: string,
  options?: { preview?: boolean; emailOnly?: boolean }
) {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (!token) throw new Error('Not authenticated');

  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const payload: Record<string, unknown> = {
    date,
    recipientType,
    ...(options || {}),
  };

  if (recipientType === 'visiting_agent') {
    payload.profileId = agentId;
  } else {
    payload.agentId = agentId;
  }

  const res = await fetch(`${baseUrl}/api/admin/visits/send-day-summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to send summary');
  return json;
}
