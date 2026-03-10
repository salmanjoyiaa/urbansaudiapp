// Reused from web app — adapted for mobile usage

import type {
  UserRole,
  AgentStatus,
  AgentType,
  VisitStatus,
  VisitingStatus,
} from './enums';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  profile_id: string;
  agent_type: AgentType;
  license_number: string | null;
  company_name: string | null;
  bio: string | null;
  status: AgentStatus;
  created_at: string;
  updated_at: string;
}

export interface VisitRequest {
  id: string;
  property_id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string;
  visit_date: string;
  visit_time: string;
  status: VisitStatus;
  visiting_agent_id: string | null;
  customer_remarks: string | null;
  visiting_status: VisitingStatus | null;
  admin_notes: string | null;
  confirmed_by: string | null;
  confirmed_at: string | null;
  reschedule_reason: string | null;
  reschedule_date: string | null;
  reschedule_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  agent_id: string;
  title: string;
  property_ref: string | null;
  location_url: string | null;
  visiting_agent_instructions: string | null;
  visiting_agent_image: string | null;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  metadata: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Joined types for mobile views
export interface VisitWithDetails extends VisitRequest {
  properties: {
    id: string;
    title: string;
    property_ref: string | null;
    location_url: string | null;
    visiting_agent_instructions: string | null;
    visiting_agent_image: string | null;
    agents: {
      profiles: {
        full_name: string;
        phone: string | null;
      } | null;
    } | null;
  } | null;
  visiting_agent: {
    id: string;
    full_name: string;
    phone: string | null;
  } | null;
}

export interface VisitingAgentOption {
  id: string;
  name: string;
}

export interface DashboardCounts {
  pendingProperties: number;
  pendingPropertyAgents: number;
  pendingVisitingAgents: number;
  pendingVisits: number;
  pendingLeads: number;
  pendingMaintenance: number;
  activeProperties: number;
  approvedPropertyAgents: number;
  approvedVisitingAgents: number;
  totalCustomers: number;
}

export interface VisitStatusCounts {
  pending: number;
  assigned: number;
  confirmed: number;
  cancelled: number;
  completed: number;
}
