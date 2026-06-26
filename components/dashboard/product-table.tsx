'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Eye, Download, Plus, Search, Filter, QrCode } from 'lucide-react'
import { type AuditStatus } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'
import { QrModal } from '@/components/dashboard/qr-modal'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { usePolling } from '@/lib/use-polling'
import type { MaterialPassport, ProductSubmission } from '@/lib/types'

type TableRow = {
  name: string
  qr: string
  passportId?: string
  material: string
  status: AuditStatus
  date: string
  progress: number
}

function mapSubmissionToRow(
  submission: ProductSubmission,
  passport?: MaterialPassport | null,
): TableRow {
  const statusMap: Record<string, AuditStatus> = {
    approved: 'Terverifikasi',
    pending_audit: 'Proses Audit',
    in_review: 'Proses Audit',
    rejected: 'Menunggu Input',
    draft: 'Menunggu Input',
  }
  const progressMap: Record<string, number> = {
    approved: 100,
    pending_audit: 40,
    in_review: 65,
    rejected: 10,
    draft: 5,
  }

  return {
    name: submission.productName,
    qr: passport ? passport.id.slice(0, 13).toUpperCase() : submission.id.slice(0, 13).toUpperCase(),
    passportId: passport?.id,
    material: submission.fiberType,
    status: statusMap[submission.status] ?? 'Menunggu Input',
    date: new Date(submission.submittedAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    progress: progressMap[submission.status] ?? 10,
  }
}

function StatusBadge({ status }: { status: AuditStatus }) {
  const styles: Record<AuditStatus, string> = {
    Terverifikasi: 'bg-teal/10 text-teal ring-1 ring-teal/20',
    'Proses Audit': 'bg-gold/12 text-gold ring-1 ring-gold/20',
    'Menunggu Input': 'bg-surface text-muted-foreground ring-1 ring-border',
  }
  const dotColors: Record<AuditStatus, string> = {
    Terverifikasi: 'bg-teal animate-pulse',
    'Proses Audit': 'bg-gold',
    'Menunggu Input': 'bg-muted-foreground',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        styles[status],
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[status])} />
      {status}
    </span>
  )
}

function ProgressBar({ progress, status }: { progress: number; status: AuditStatus }) {
  const color =
    status === 'Terverifikasi'
      ? 'bg-teal'
      : status === 'Proses Audit'
        ? 'bg-gold'
        : 'bg-muted-foreground/30'
  return (
    <div className="h-1 w-24 overflow-hidden rounded-full bg-surface">
      <div
        className={cn('h-full rounded-full transition-all', color)}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export function ProductTable() {
  const { statusFilter, registerTableRef } = useDashboard()
  const [products, setProducts] = useState<TableRow[]>([])
  const [localSearch, setLocalSearch] = useState('')
  const [localFilter, setLocalFilter] = useState<AuditStatus | 'all'>('all')
  const [showFilter, setShowFilter] = useState(false)
  const [qrModal, setQrModal] = useState<{ id: string; name: string } | null>(null)

  const effectiveSearch = localSearch
  const effectiveFilter = statusFilter !== 'all' ? statusFilter : localFilter

  const loadProducts = useCallback(async () => {
    try {
      const [subRes, passRes] = await Promise.all([
        fetch('/api/submissions'),
        fetch('/api/passports'),
      ])
      const submissions: ProductSubmission[] = await subRes.json()
      const passports: MaterialPassport[] = await passRes.json()
      const passportMap = new Map(passports.map((p) => [p.submissionId, p]))
      setProducts(
        submissions.map((s) => mapSubmissionToRow(s, passportMap.get(s.id))),
      )
    } catch {
      // silently ignore polling failures
    }
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])
  usePolling(loadProducts)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !effectiveSearch || p.name.toLowerCase().includes(effectiveSearch.toLowerCase())
      const matchFilter = effectiveFilter === 'all' || p.status === effectiveFilter
      return matchSearch && matchFilter
    })
  }, [products, effectiveSearch, effectiveFilter])

  return (
    <>
      <div
        ref={registerTableRef}
        className="rounded-2xl border border-border bg-card shadow-sm"
      >
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">
              Produk Terdaftar
            </h2>
            <p className="text-xs text-muted-foreground">
              Material passport per produk · {filtered.length} produk aktif
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Cari produk..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="h-8 w-40 rounded-lg border border-border bg-surface pl-8 pr-3 text-xs outline-none focus:border-gold"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                aria-label="Filter produk"
                onClick={() => setShowFilter(!showFilter)}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                <Filter className="h-3.5 w-3.5" />
                Filter
              </button>
              {showFilter && (
                <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-xl border border-border bg-card p-1 shadow-lg">
                  {(['all', 'Terverifikasi', 'Proses Audit', 'Menunggu Input'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => { setLocalFilter(f); setShowFilter(false) }}
                      className={cn(
                        'w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-surface',
                        effectiveFilter === f && 'bg-surface font-semibold',
                      )}
                    >
                      {f === 'all' ? 'Semua Status' : f}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/dashboard/new"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
                <th className="px-5 py-3.5 font-medium">Nama Produk</th>
                <th className="px-5 py-3.5 font-medium">Kode QR</th>
                <th className="px-5 py-3.5 font-medium">Material Utama</th>
                <th className="px-5 py-3.5 font-medium">Status Audit</th>
                <th className="px-5 py-3.5 font-medium">Progres</th>
                <th className="px-5 py-3.5 font-medium">Tanggal</th>
                <th className="px-5 py-3.5 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.qr}
                  className="group border-b border-border last:border-0 transition-colors hover:bg-surface/50"
                >
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-foreground">{p.name}</span>
                  </td>
                  <td className="px-5 py-4">
                    {p.passportId ? (
                      <button
                        type="button"
                        onClick={() => setQrModal({ id: p.passportId!, name: p.name })}
                        className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2 py-1 font-mono text-[11px] tracking-wide text-muted-foreground hover:text-gold transition-colors"
                      >
                        <QrCode className="h-3 w-3" />
                        {p.qr}
                      </button>
                    ) : (
                      <code className="rounded-md bg-surface px-2 py-1 font-mono text-[11px] tracking-wide text-muted-foreground">
                        {p.qr}
                      </code>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{p.material}</td>
                  <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <ProgressBar progress={p.progress} status={p.status} />
                      <span className="text-xs tabular-nums text-muted-foreground">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{p.date}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {p.passportId ? (
                        <Link
                          href={`/passport/${p.passportId}`}
                          aria-label={`Lihat passport ${p.name}`}
                          className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Passport
                        </Link>
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/30">
                          <Eye className="h-3.5 w-3.5" />
                        </span>
                      )}
                      <button
                        type="button"
                        aria-label={`Unduh passport ${p.name}`}
                        disabled={p.status !== 'Terverifikasi'}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {qrModal && (
        <QrModal
          open={!!qrModal}
          onOpenChange={(open) => !open && setQrModal(null)}
          passportId={qrModal.id}
          productName={qrModal.name}
        />
      )}
    </>
  )
}
