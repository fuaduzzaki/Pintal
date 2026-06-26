'use client'

import { useState, useEffect, useCallback } from 'react'
import { Boxes, QrCode, BadgeCheck, FileText, TrendingUp } from 'lucide-react'
import { CsrdReportModal } from '@/components/dashboard/csrd-report-modal'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { usePolling } from '@/lib/use-polling'
import type { MaterialPassport, ProductSubmission } from '@/lib/types'

const ICONS = [Boxes, QrCode, BadgeCheck, FileText]
const COLORS = [
  { icon: 'bg-foreground text-background', metric: 'text-foreground' },
  { icon: 'bg-teal/10 text-teal', metric: 'text-foreground' },
  { icon: 'bg-teal/10 text-teal', metric: 'text-foreground' },
  { icon: 'bg-gold/12 text-gold', metric: 'text-foreground' },
]

export function SummaryCards() {
  const { setStatusFilter, scrollToTable } = useDashboard()
  const [stats, setStats] = useState([
    { key: 'Total Produk Terdaftar', value: '...', sub: '...' },
    { key: 'QR Code Aktif', value: '...', sub: '...' },
    { key: 'Audit LSM Selesai', value: '...', sub: '...' },
    { key: 'Laporan CSRD Tersedia', value: '...', sub: '...' },
  ])
  const [csrdOpen, setCsrdOpen] = useState(false)

  const loadStats = useCallback(async () => {
    try {
      const [subRes, passRes] = await Promise.all([
        fetch('/api/submissions'),
        fetch('/api/passports'),
      ])
      const submissions: ProductSubmission[] = await subRes.json()
      const passports: MaterialPassport[] = await passRes.json()
      const total = submissions.length
      const qrActive = passports.filter((p) => p.status === 'active').length
      const verified = submissions.filter((s) => s.status === 'approved').length
      const inProgress = submissions.filter((s) => s.status === 'pending_audit' || s.status === 'in_review').length

      setStats([
        { key: 'Total Produk Terdaftar', value: String(total), sub: '+6 bulan ini' },
        { key: 'QR Code Aktif', value: String(qrActive), sub: `${total > 0 ? Math.round((qrActive / total) * 100) : 0}% dari produk` },
        { key: 'Audit LSM Selesai', value: String(verified), sub: `${inProgress} dalam proses` },
        { key: 'Laporan CSRD Tersedia', value: String(qrActive), sub: 'Kuartal berjalan' },
      ])
    } catch {
      // silently ignore polling failures
    }
  }, [])

  useEffect(() => { loadStats() }, [loadStats])
  usePolling(loadStats)

  const handleCardClick = (index: number) => {
    if (index === 0) scrollToTable()
    if (index === 1) setStatusFilter('Terverifikasi')
    if (index === 2) setStatusFilter('Terverifikasi')
    if (index === 3) setCsrdOpen(true)
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((card, i) => {
          const Icon = ICONS[i]
          const style = COLORS[i]
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => handleCardClick(i)}
              className="card-lift group rounded-2xl border border-border bg-card p-5 shadow-sm text-left transition-all hover:border-gold/30"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {card.key}
                </p>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ${style.icon}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
              </div>
              <p className={`mt-4 font-serif text-4xl font-bold tracking-tight ${style.metric}`}>
                {card.value}
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3 text-teal" />
                <p className="text-xs text-muted-foreground">{card.sub}</p>
              </div>
            </button>
          )
        })}
      </div>
      <CsrdReportModal open={csrdOpen} onOpenChange={setCsrdOpen} />
    </>
  )
}
