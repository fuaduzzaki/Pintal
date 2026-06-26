import { auth } from '@/lib/auth'
import type { UserRole } from '@/lib/types'
import { NextResponse } from 'next/server'

export async function requireAuth(roles?: UserRole[]) {
  const session = await auth()
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), session: null }
  }
  if (roles && !roles.includes(session.user.role)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), session: null }
  }
  return { error: null, session }
}
