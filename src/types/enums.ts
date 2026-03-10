// Reused from web app — exact same types for consistency

export type UserRole = 'customer' | 'agent' | 'admin';
export type AgentStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type AgentType = 'property' | 'visiting';
export type VisitStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'assigned';

export type VisitingStatus =
  | 'view'
  | 'contact_done'
  | 'customer_confirmed'
  | 'customer_arrived'
  | 'visit_done'
  | 'customer_remarks'
  | 'deal_pending'
  | 'deal_fail'
  | 'commission_got'
  | 'deal_close'
  | 'reschedule';

export type LeadStatus = 'pending' | 'confirmed' | 'rejected' | 'completed';
export type MaintenanceStatus = 'pending' | 'approved' | 'completed' | 'rejected';
