import type { UserRole } from './types'

export function getRoleRedirect(role: UserRole): string {
  switch (role) {
    case 'brand':
      return '/dashboard'
    case 'artisan':
      return '/artisan'
    case 'lsm_auditor':
      return '/auditor'
    default:
      return '/login'
  }
}
