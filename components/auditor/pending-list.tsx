'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, MapPin, User } from 'lucide-react'
import type { ProductSubmission, SubmissionStatus } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type FilterTab = 'all' | 'pending' | 'processed'

const STATUS_MAP: Record<SubmissionStatus, { label: string; variant: 'warning' | 'info' | 'success' | 'danger' | 'secondary' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  pending_audit: { label: 'Menunggu Review', variant: 'warning' },
  in_review: { label: 'Proses Review', variant: 'info' },
  approved: { label: 'Disetujui', variant: 'success' },
  rejected: { label: 'Ditolak', variant: 'danger' },
}

export function PendingList() {
  const [submissions, setSubmissions] = useState<ProductSubmission[]>([])
  const [filter, setFilter] = useState<FilterTab>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/submissions')
      .then((r) => r.json())
      .then(setSubmissions)
      .finally(() => setLoading(false))
  }, [])

  const filtered = submissions.filter((s) => {
    if (filter === 'pending') return s.status === 'pending_audit' || s.status === 'in_review'
    if (filter === 'processed') return s.status === 'approved' || s.status === 'rejected'
    return true
  })

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Menunggu Review' },
    { key: 'processed', label: 'Sudah Diproses' },
  ]

  if (loading) {
    return <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Memuat submission...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-semibold transition-colors',
              filter === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-card text-muted-foreground hover:bg-surface',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((s) => {
          const st = STATUS_MAP[s.status]
          const isPending = s.status === 'pending_audit' || s.status === 'in_review'
          return (
            <div key={s.id} className="card-lift rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{s.productName}</h3>
                    <Badge variant="outline">{s.productType}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3 w-3" /> {s.artisanName}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {s.geoLocation?.address ?? s.materialOrigin}
                    </span>
                    <span>
                      {new Date(s.submittedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="mt-2">
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </div>
                </div>
                {isPending && (
                  <Link
                    href={`/auditor/review/${s.id}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Mulai Review
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Tidak ada submission untuk filter ini.
        </div>
      )}
    </div>
  )
}

export function AuditorSummaryCards() {
  const [stats, setStats] = useState({ pending: 0, today: 0, approved: 0, rejected: 0 })

  useEffect(() => {
    fetch('/api/submissions')
      .then((r) => r.json())
      .then((data: ProductSubmission[]) => {
        const today = new Date().toDateString()
        setStats({
          pending: data.filter((s) => s.status === 'pending_audit' || s.status === 'in_review').length,
          today: data.filter((s) => {
            const d = new Date(s.updatedAt).toDateString()
            return d === today && (s.status === 'approved' || s.status === 'rejected')
          }).length,
          approved: data.filter((s) => s.status === 'approved').length,
          rejected: data.filter((s) => s.status === 'rejected').length,
        })
      })
  }, [])

  const cards = [
    { label: 'Menunggu Review', value: stats.pending },
    { label: 'Selesai Hari Ini', value: stats.today },
    { label: 'Total Disetujui', value: stats.approved },
    { label: 'Total Ditolak', value: stats.rejected },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{c.label}</p>
          <p className="mt-2 font-serif text-4xl font-bold text-foreground">{c.value}</p>
        </div>
      ))}
    </div>
  )
}
