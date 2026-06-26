import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { requireAuth } from '@/lib/api-auth'
import { saveUpload, getUpload } from '@/lib/db'

export async function POST(request: NextRequest) {
  const { error } = await requireAuth(['artisan'])
  if (error) return error

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
  const id = randomUUID()
  saveUpload(id, base64)

  return NextResponse.json({ url: `/api/upload?id=${id}`, id })
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const data = getUpload(id)
  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const match = data.match(/^data:(.+);base64,(.+)$/)
  if (!match) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 500 })
  }

  const buffer = Buffer.from(match[2], 'base64')
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': match[1],
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
