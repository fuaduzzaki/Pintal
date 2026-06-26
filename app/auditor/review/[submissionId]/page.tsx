'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useParams } from 'next/navigation'
import { AuditorHeader } from '@/components/auditor/auditor-header'
import { SubmissionDetail } from '@/components/auditor/submission-detail'
import { ReviewForm } from '@/components/auditor/review-form'
import type { ProductSubmission } from '@/lib/types'

export default function AuditorReviewPage() {
  const params = useParams()
  const submissionId = params.submissionId as string
  const [submission, setSubmission] = useState<ProductSubmission | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/submissions/${submissionId}`)
      .then((r) => r.json())
      .then((data) => setSubmission(data.submission))
      .finally(() => setLoading(false))
  }, [submissionId])

  return (
    <div className="min-h-screen bg-background">
      <AuditorHeader />
      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <Link href="/auditor" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </Link>

        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat submission...</p>
        ) : !submission ? (
          <p className="text-sm text-destructive">Submission tidak ditemukan</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <SubmissionDetail submission={submission} />
            <ReviewForm submissionId={submissionId} />
          </div>
        )}
      </main>
    </div>
  )
}
