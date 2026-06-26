'use client'

import { useState, useEffect, useCallback } from 'react'
import { FileText, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { getStoredProducts } from '@/lib/storage'
import { type Product } from '@/lib/dashboard-data'
import { CsrdReportModal } from '@/components/dashboard/csrd-report-modal'
import { usePolling } from '@/lib/use-polling'
import type { ProductSubmission } from '@/lib/types'

export function AuditStatus() {
  const [products, setProducts] = useState<Product[]>([])
  const [verifiedCount, setVerifiedCount] = useState(0)
  const [csrdOpen, setCsrdOpen] = useState(false)

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/submissions')
      const submissions: ProductSubmission[] = await res.json()
      const verified = submissions.filter((s) => s.status === 'approved').length
      setVerifiedCount(verified)

      const mapped: Product[] = submissions.map((s) => ({
        name: s.productName,
        qr: s.id.slice(0, 13),
        material: s.fiberType,
        status: s.status === 'approved' ? 'Terverifikasi' : s.status === 'pending_audit' || s.status === 'in_review' ? 'Proses Audit' : 'Menunggu Input',
        date: new Date(s.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        progress: s.status === 'approved' ? 100 : s.status === 'in_review' ? 65 : s.status === 'pending_audit' ? 40 : 10,
      }))
      setProducts(mapped)
    } catch {
      setProducts(getStoredProducts())
    }
  }, [])

  useEffect(() => { loadStatus() }, [loadStatus])
  usePolling(loadStatus)

  const auditQueue = products
    .filter((p) => p.status !== 'Terverifikasi')
    .map((p) => ({ name: p.name, status: p.status, progress: p.progress }))

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 via-gold/6 to-transparent p-5">
          <div
            aria-hidden="true"
            className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/20 blur-2xl"
          />

          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-primary-foreground shadow-lg shadow-gold/30">
              <FileText className="h-5 w-5" />
            </div>

            <h3 className="mt-4 font-serif text-lg font-bold text-foreground">
              Laporan CSRD siap dibuat
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">{verifiedCount} produk</span>{' '}
              telah lolos audit LSM. Hasilkan laporan kepatuhan CSRD &amp; EPR untuk buyer dan
              investor.
            </p>

            <button
              type="button"
              onClick={() => setCsrdOpen(true)}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 font-semibold text-primary-foreground shadow-md shadow-gold/20 hover:bg-primary/90 transition-colors"
            >
              Generate Laporan CSRD
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
              Format: PDF · CSRD Annex · EPR ready
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-foreground">
                Status Verifikasi LSM
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Progres audit per produk berjalan
              </p>
            </div>
            <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {auditQueue.length} aktif
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-5">
            {auditQueue.map((item) => {
              const isInProgress = item.status === 'Proses Audit'
              const Icon = isInProgress ? Clock : AlertCircle
              const iconColor = isInProgress ? 'text-gold' : 'text-muted-foreground'
              const barColor = isInProgress ? 'bg-gold' : 'bg-muted-foreground/40'

              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`h-3.5 w-3.5 shrink-0 ${iconColor}`} />
                      <span className="truncate text-sm font-medium text-foreground">
                        {item.name}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                      {item.progress}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{item.status}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex items-center gap-4 border-t border-border pt-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal" />
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{verifiedCount}</span> selesai
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{auditQueue.length}</span> berjalan
              </span>
            </div>
          </div>
        </div>
      </div>
      <CsrdReportModal open={csrdOpen} onOpenChange={setCsrdOpen} />
    </>
  )
}
