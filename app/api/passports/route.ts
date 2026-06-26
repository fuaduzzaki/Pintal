import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getPassports } from '@/lib/db'

export async function GET() {
  const { error, session } = await requireAuth(['brand'])
  if (error) return error

  const passports = getPassports({ brandId: session!.user.id })
  return NextResponse.json(passports)
}
