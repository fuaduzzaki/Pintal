import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getPassports } from '@/lib/db'

export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth(['brand'])
  if (error) return error

  const body = await request.json()
  const period = body.period ?? 'Q2 2026'

  const passports = getPassports({ brandId: session!.user.id }).filter(
    (p) => p.status === 'active',
  )

  return NextResponse.json({
    summary: {
      period,
      totalProducts: passports.length,
      verifiedProducts: passports.length,
      brandName: session!.user.organizationName,
    },
    passports,
  })
}
