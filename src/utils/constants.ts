import { colors } from '@/theme';
import type { VisitStatus, VisitingStatus } from '@/types';

/** Human-readable labels for visit statuses */
export const VISIT_STATUS_LABELS: Record<VisitStatus, string> = {
  pending: 'Pending',
  assigned: 'Assigned',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

/** Ionicons icon names for each visit status */
export const VISIT_STATUS_ICONS: Record<VisitStatus, string> = {
  pending: 'time-outline',
  assigned: 'person-outline',
  confirmed: 'checkmark-circle-outline',
  cancelled: 'close-circle-outline',
  completed: 'ribbon-outline',
};

/** Human-readable labels for visiting (agent-side) statuses */
export const VISITING_STATUS_LABELS: Record<VisitingStatus, string> = {
  view: 'View',
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

/** Returns { bg, text, border } color set for a given visit status */
export function getStatusColors(status: VisitStatus) {
  return (
    colors.status[status as keyof typeof colors.status] ?? {
      bg: colors.surfaceElevated,
      text: colors.textSecondary,
      border: colors.border,
    }
  );
}
