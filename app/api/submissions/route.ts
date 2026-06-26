import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { createSubmission, getSubmissions } from '@/lib/db'
import { BRAND_ID } from '@/lib/db'

export async function GET() {
  const { error, session } = await requireAuth(['brand', 'artisan', 'lsm_auditor'])
  if (error) return error

  const role = session!.user.role
  const filters =
    role === 'artisan'
      ? { artisanId: session!.user.id }
      : role === 'brand'
        ? { brandId: session!.user.id }
        : {}

  const submissions = getSubmissions(filters)
  return NextResponse.json(submissions)
}

export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth(['artisan'])
  if (error) return error

  const body = await request.json()

  const submission = createSubmission({
    artisanId: session!.user.id,
    artisanName: session!.user.name,
    brandId: BRAND_ID,
    productName: body.productName,
    productType: body.productType,
    materialOrigin: body.materialOrigin,
    fiberType: body.fiberType,
    dyeMethod: body.dyeMethod,
    productionProcess: body.productionProcess,
    photos: body.photos ?? [],
    geoLocation: body.geoLocation ?? {
      lat: 0,
      lng: 0,
      address: body.location ?? body.materialOrigin,
    },
  })

  return NextResponse.json(submission, { status: 201 })
}
