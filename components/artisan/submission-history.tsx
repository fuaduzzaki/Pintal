'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, Eye, Pencil, Plus } from 'lucide-react'
import type { ProductSubmission, SubmissionStatus } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_MAP: Record<
  SubmissionStatus,
  { label: string; variant: 'warning' | 'info' | 'success' | 'danger' | 'secondary' }
> = {
  draft: { label: 'Draft', variant: 'secondary' },
  pending_audit: { label: 'Menunggu Audit', variant: 'warning' },
  in_review: { label: 'Proses Review', variant: 'info' },
  approved: { label: 'Terverifikasi', variant: 'success' },
  rejected: { label: 'Ditolak', variant: 'danger' },
}

export function SubmissionHistory() {
  const [submissions, setSubmissions] = useState<ProductSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/submissions')
      .then((r) => r.json())
      .then(setSubmissions)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Memuat data...</div>
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-lg font-bold text-foreground">Riwayat Submission</h2>
          <p className="text-xs text-muted-foreground">{submissions.length} produk</p>
        </div>
        <Link
          href="/artisan/submit"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Produk Baru
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
              <th className="px-5 py-3 font-medium">Nama Produk</th>
              <th className="px-5 py-3 font-medium">Jenis</th>
              <th className="px-5 py-3 font-medium">Tanggal Submit</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => {
              const st = STATUS_MAP[s.status]
              return (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                  <td className="px-5 py-4 text-sm font-semibold">{s.productName}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{s.productType}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {new Date(s.submittedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface" aria-label="Lihat detail">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      {(s.status === 'draft' || s.status === 'rejected') && (
                        <Link
                          href={`/artisan/submit?edit=${s.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface"
                          aria-label="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {submissions.length === 0 && (
        <div className="p-8 text-center">
          <Clock className="mx-auto h-8 w-8 text-gold/40" />
          <p className="mt-2 text-sm text-muted-foreground">Belum ada submission. Mulai dengan menambah produk baru.</p>
        </div>
      )}
    </div>
  )
}

export function ArtisanSummaryCards() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })

  useEffect(() => {
    fetch('/api/submissions')
      .then((r) => r.json())
      .then((data: ProductSubmission[]) => {
        setStats({
          total: data.length,
          pending: data.filter((s) => s.status === 'pending_audit' || s.status === 'in_review').length,
          approved: data.filter((s) => s.status === 'approved').length,
          rejected: data.filter((s) => s.status === 'rejected').length,
        })
      })
  }, [])

  const cards = [
    { label: 'Produk Disubmit', value: stats.total, color: 'text-foreground' },
    { label: 'Menunggu Audit', value: stats.pending, color: 'text-gold' },
    { label: 'Terverifikasi', value: stats.approved, color: 'text-teal' },
    { label: 'Ditolak', value: stats.rejected, color: 'text-destructive' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">{c.label}</p>
          <p className={cn('mt-1 font-serif text-3xl font-bold', c.color)}>{c.value}</p>
        </div>
      ))}
    </div>
  )
}
