import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import {
  createAuditRecord,
  createPassport,
  getPassportBySubmissionId,
  getSubmissionById,
  updateSubmission,
} from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, session } = await requireAuth(['brand', 'artisan', 'lsm_auditor'])
  if (error) return error

  const { id } = await params
  const submission = getSubmissionById(id)
  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  const role = session!.user.role
  if (role === 'artisan' && submission.artisanId !== session!.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (role === 'brand' && submission.brandId !== session!.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const passport = getPassportBySubmissionId(id)
  return NextResponse.json({ submission, passport })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, session } = await requireAuth(['lsm_auditor', 'artisan'])
  if (error) return error

  const { id } = await params
  const submission = getSubmissionById(id)
  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  const body = await request.json()

  if (session!.user.role === 'artisan') {
    if (submission.artisanId !== session!.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (!['draft', 'rejected'].includes(submission.status)) {
      return NextResponse.json({ error: 'Cannot edit this submission' }, { status: 400 })
    }
    const updated = updateSubmission(id, {
      ...body,
      status: 'pending_audit',
    })
    return NextResponse.json(updated)
  }

  const { decision, notes, rejectionReason } = body
  if (!decision || !notes) {
    return NextResponse.json({ error: 'Decision and notes required' }, { status: 400 })
  }
  if (decision === 'rejected' && !rejectionReason) {
    return NextResponse.json({ error: 'Rejection reason required' }, { status: 400 })
  }

  const newStatus = decision === 'approved' ? 'approved' : 'rejected'
  const updated = updateSubmission(id, {
    status: newStatus,
  })

  createAuditRecord({
    submissionId: id,
    auditorId: session!.user.id,
    auditorName: session!.user.name,
    auditorOrganization: session!.user.organizationName,
    decision,
    notes,
    rejectionReason,
  })

  let passport = null
  if (decision === 'approved' && updated) {
    passport = createPassport(
      updated,
      session!.user.name,
      session!.user.organizationName,
    )
  }

  return NextResponse.json({ submission: updated, passport })
}
