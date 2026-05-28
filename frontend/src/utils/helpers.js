import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Format a date string into readable format
 */
export function formatDate(dateStr, pattern = 'MMM d, yyyy') {
  if (!dateStr) return '—';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, pattern);
}

/**
 * Format date with time
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'MMM d, yyyy · h:mm a');
}

/**
 * Relative time (e.g., "2 hours ago")
 */
export function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Smart date formatting — today, yesterday, or full date
 */
export function smartDate(dateStr) {
  if (!dateStr) return '—';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`;
  if (isYesterday(date)) return `Yesterday at ${format(date, 'h:mm a')}`;
  return format(date, 'MMM d, yyyy');
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Format a number with commas for display
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
}

/**
 * Format a complaint status into readable label
 */
export function formatStatus(status) {
  const statusMap = {
    SUBMITTED: 'Submitted',
    UNDER_REVIEW: 'Under Review',
    ASSIGNED: 'Assigned',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    VERIFIED: 'Verified',
    REJECTED: 'Rejected',
    ESCALATED: 'Escalated',
    CLOSED: 'Closed',
  };
  return statusMap[status] || capitalize(status?.replace(/_/g, ' '));
}

/**
 * Status color mapping for badges
 */
export function getStatusColor(status) {
  const colorMap = {
    SUBMITTED: 'neutral',
    UNDER_REVIEW: 'info',
    ASSIGNED: 'info',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success',
    VERIFIED: 'success',
    REJECTED: 'error',
    ESCALATED: 'error',
    CLOSED: 'neutral',
  };
  return colorMap[status] || 'neutral';
}

/**
 * Priority labels and colors
 */
export function getPriorityConfig(priority) {
  const config = {
    CRITICAL: { label: 'Critical', color: 'error', dot: 'bg-error-500' },
    HIGH: { label: 'High', color: 'warning', dot: 'bg-warning-500' },
    MEDIUM: { label: 'Medium', color: 'info', dot: 'bg-accent-500' },
    LOW: { label: 'Low', color: 'neutral', dot: 'bg-neutral-400' },
  };
  return config[priority] || config.MEDIUM;
}

/**
 * Truncate text to specified length
 */
export function truncate(text, maxLength = 80) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

/**
 * Generate initials from a name
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Complaint categories
 */
export const COMPLAINT_CATEGORIES = [
  { value: 'GARBAGE_DUMP', label: 'Garbage Dump' },
  { value: 'STREET_WASTE', label: 'Street Waste' },
  { value: 'OVERFLOWING_BIN', label: 'Overflowing Bin' },
  { value: 'CONSTRUCTION_DEBRIS', label: 'Construction Debris' },
  { value: 'HAZARDOUS_WASTE', label: 'Hazardous Waste' },
  { value: 'GREEN_WASTE', label: 'Green Waste / Foliage' },
  { value: 'DRAINAGE_BLOCKAGE', label: 'Drainage Blockage' },
  { value: 'OTHER', label: 'Other' },
];

/**
 * User role labels
 */
export const ROLE_LABELS = {
  CITIZEN: 'Citizen',
  WORKER: 'Cleaning Worker',
  ADMIN: 'Department Admin',
  GOVERNMENT: 'Government Head',
};

/**
 * Get role-based dashboard path
 */
export function getDashboardPath(role) {
  const paths = {
    CITIZEN: '/citizen/dashboard',
    WORKER: '/worker/dashboard',
    ADMIN: '/admin/dashboard',
    GOVERNMENT: '/gov/dashboard',
  };
  return paths[role] || '/citizen/dashboard';
}
