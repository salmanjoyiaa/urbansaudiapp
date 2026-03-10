import { supabase } from './supabase';
import type { DashboardCounts } from '@/types';

export async function fetchDashboardCounts(): Promise<DashboardCounts> {
  const [
    { count: pendingProperties },
    { count: pendingPropertyAgents },
    { count: pendingVisitingAgents },
    { count: pendingVisits },
    { count: pendingLeads },
    { count: pendingMaintenance },
    { count: activeProperties },
    { count: approvedPropertyAgents },
    { count: approvedVisitingAgents },
    { count: totalCustomers },
  ] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('agents').select('id', { count: 'exact', head: true }).eq('status', 'pending').neq('agent_type', 'visiting'),
    supabase.from('agents').select('id', { count: 'exact', head: true }).eq('status', 'pending').eq('agent_type', 'visiting'),
    supabase.from('visit_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('buy_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('maintenance_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'available'),
    supabase.from('agents').select('id', { count: 'exact', head: true }).eq('status', 'approved').neq('agent_type', 'visiting'),
    supabase.from('agents').select('id', { count: 'exact', head: true }).eq('status', 'approved').eq('agent_type', 'visiting'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
  ]);

  return {
    pendingProperties: pendingProperties ?? 0,
    pendingPropertyAgents: pendingPropertyAgents ?? 0,
    pendingVisitingAgents: pendingVisitingAgents ?? 0,
    pendingVisits: pendingVisits ?? 0,
    pendingLeads: pendingLeads ?? 0,
    pendingMaintenance: pendingMaintenance ?? 0,
    activeProperties: activeProperties ?? 0,
    approvedPropertyAgents: approvedPropertyAgents ?? 0,
    approvedVisitingAgents: approvedVisitingAgents ?? 0,
    totalCustomers: totalCustomers ?? 0,
  };
}

export async function fetchRecentActivity() {
  const { data, error } = await supabase
    .from('audit_log')
    .select('id, action, entity_type, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data || [];
}
