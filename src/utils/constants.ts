import type { VisitStatus, StatusKey } from '@/types';
import { colors } from '@/theme';

export const VISIT_STATUS_LABELS: Record<VisitStatus, string> = {
  pending: 'Pending',
  assigned: 'Assigned',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

export const VISIT_STATUS_ICONS: Record<VisitStatus, string> = {
  pending: 'time-outline',
  assigned: 'person-outline',
  confirmed: 'checkmark-circle-outline',
  cancelled: 'close-circle-outline',
  completed: 'ribbon-outline',
};

export function getStatusColors(status: VisitStatus) {
  return colors.status[status as StatusKey] || colors.status.pending;
}

export const VISITING_STATUS_LABELS: Record<string, string> = {
  view: 'View Scheduled',
  contact_done: 'Contact Done',
  customer_confirmed: 'Customer Confirmed',
  customer_arrived: 'Customer Arrived',
  visit_done: 'Visit Done',
  customer_remarks: 'Customer Remarks',
  deal_pending: 'Deal Pending',
  deal_fail: 'Deal Failed',
  commission_got: 'Commission Received',
  deal_close: 'Deal Closed',
  reschedule: 'Rescheduled',
};

export const SAUDI_TIME_ZONE = 'Asia/Riyadh';
