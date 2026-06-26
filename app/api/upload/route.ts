import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'

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

  try {
    const blob = await put(file.name, file, {
      access: 'public',
    })
    return NextResponse.json({ url: blob.url, id: blob.url })
  } catch (err) {
    console.error('Vercel Blob upload error:', err)
    return NextResponse.json({ error: 'Upload failed. Check Vercel Blob configuration.' }, { status: 500 })
  }
}
