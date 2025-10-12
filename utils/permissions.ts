import { CREW_PERMISSION_LEVELS, SALESPERSON_PERMISSION_LEVELS, UserPermissions, UserRole } from '@/types/userRoles';

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  permission: keyof UserPermissions,
  role: UserRole,
  permissionLevel?: number
): boolean {
  // Admin always has all permissions
  if (role === 'admin') return true;

  // For crew, check based on permission level
  if (role === 'crew' && permissionLevel) {
    const levelPermissions = CREW_PERMISSION_LEVELS[permissionLevel as 1 | 2 | 3];
    return levelPermissions[permission];
  }

  // For salesperson, check based on permission level
  if (role === 'salesperson' && permissionLevel) {
    const levelPermissions = SALESPERSON_PERMISSION_LEVELS[permissionLevel as 1 | 2 | 3];
    return levelPermissions[permission];
  }

  // For accountant or other roles, return false (they have specific permissions)
  return false;
}

/**
 * Routes that crew members can access
 */
export const CREW_ALLOWED_ROUTES = [
  '/my-day',
  '/crew-jobs',
  '/(tabs)/work-orders',
  '/job-schedule',
  '/timesheets',
  '/(tabs)/team-chat',
  '/(tabs)/tasks',
  '/notifications',
  '/my-profile',
];

/**
 * Level 2 crew additional routes
 */
export const LEVEL_2_ROUTES = [
  '/(tabs)/chat',
  '/(tabs)/phone',
];

/**
 * Routes that salespeople can access
 */
export const SALESPERSON_ALLOWED_ROUTES = [
  '/scoreboard',
  '/(tabs)/pipeline',
  '/appointments',
  '/job-schedule',
  '/timesheets',
  '/(tabs)/', // My Day (admin dashboard)
  '/(tabs)/team-chat',
  '/(tabs)/tasks',
  '/notifications',
  '/my-profile',
];

/**
 * Level 2 salesperson additional routes
 */
export const SALESPERSON_LEVEL_2_ROUTES = [
  '/(tabs)/chat',
  '/(tabs)/phone',
  '/email',
];

/**
 * Check if a route is accessible for a user
 */
export function canAccessRoute(
  route: string,
  role: UserRole,
  permissionLevel?: number
): boolean {
  // Admin and accountant can access all routes
  if (role === 'admin' || role === 'accountant') return true;

  // Crew members have restricted access
  if (role === 'crew') {
    // Check base allowed routes
    const isBaseRouteAllowed = CREW_ALLOWED_ROUTES.some(
      allowedRoute => route.startsWith(allowedRoute)
    );

    if (isBaseRouteAllowed) return true;

    // Check level 2 routes
    if (permissionLevel && permissionLevel >= 2) {
      return LEVEL_2_ROUTES.some(allowedRoute => route.startsWith(allowedRoute));
    }

    return false;
  }

  // Salespeople have restricted access
  if (role === 'salesperson') {
    // Check base allowed routes
    const isBaseRouteAllowed = SALESPERSON_ALLOWED_ROUTES.some(
      allowedRoute => route.startsWith(allowedRoute)
    );

    if (isBaseRouteAllowed) return true;

    // Check level 2 routes
    if (permissionLevel && permissionLevel >= 2) {
      return SALESPERSON_LEVEL_2_ROUTES.some(allowedRoute => route.startsWith(allowedRoute));
    }

    return false;
  }

  return true;
}

/**
 * Get redirect route for unauthorized access
 */
export function getRedirectRoute(role: UserRole): string {
  if (role === 'crew') return '/my-day';
  if (role === 'salesperson') return '/scoreboard';
  if (role === 'accountant') return '/invoices';
  return '/(tabs)/';
}

/**
 * Features that crew members cannot access
 */
export const CREW_RESTRICTED_FEATURES = [
  'dashboard',
  'contacts',
  'businesses',
  'pipeline',
  'products',
  'invoices',
  'proposals',
  'crews',
  'reviews',
  'website',
  'email',
  'drips',
  'automations',
  'metrics',
  'booking-forms',
  'recurring-jobs',
  'account-settings', // Crew has my-profile instead
];

/**
 * Features that salespeople cannot access
 */
export const SALESPERSON_RESTRICTED_FEATURES = [
  'contacts', // Cannot create/manage contacts
  'businesses', // Cannot create/manage businesses
  'products',
  'invoices',
  'work-orders',
  'crews',
  'reviews',
  'website',
  'drips',
  'automations',
  'metrics', // Has scoreboard instead
  'booking-forms',
  'recurring-jobs',
  'account-settings', // Salesperson has my-profile instead
];

/**
 * Check if a feature is restricted for a role
 */
export function isFeatureRestricted(feature: string, role: UserRole): boolean {
  if (role === 'crew') return CREW_RESTRICTED_FEATURES.includes(feature);
  if (role === 'salesperson') return SALESPERSON_RESTRICTED_FEATURES.includes(feature);
  return false;
}

