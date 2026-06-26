import { NextResponse } from 'next/server'
import { getPassportById } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const passport = getPassportById(id)

  if (!passport || passport.status !== 'active') {
    return NextResponse.json({ error: 'Passport not found' }, { status: 404 })
  }

  const expiresAt = new Date(passport.expiresAt)
  if (expiresAt < new Date()) {
    return NextResponse.json({ error: 'Passport expired' }, { status: 410 })
  }

  return NextResponse.json(passport)
}
