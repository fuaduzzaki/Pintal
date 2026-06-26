import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getAuditRecords } from '@/lib/db'

export async function GET() {
  const { error } = await requireAuth(['brand', 'lsm_auditor'])
  if (error) return error

  const records = getAuditRecords()
  return NextResponse.json(records)
}
