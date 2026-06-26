'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  Package,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react'
import { getStoredProducts } from '@/lib/storage'
import { type AuditStatus, type Product } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

type FilterStatus = 'Semua' | AuditStatus

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('Semua')
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    setProducts(getStoredProducts())
  }, [])

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.qr.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'Semua' || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const FILTER_OPTIONS: FilterStatus[] = ['Semua', 'Terverifikasi', 'Proses Audit', 'Menunggu Input']

  return (
    <div className="px-5 py-8 md:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-foreground font-medium">Produk & Passport</span>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground">
            Produk & Passport
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola semua produk dan material passport brand Anda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground hover:bg-surface transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Produk
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: 'Total Produk', value: products.length.toString(), color: 'text-foreground' },
          { label: 'Terverifikasi', value: products.filter(p => p.status === 'Terverifikasi').length.toString(), color: 'text-teal' },
          { label: 'Proses Audit', value: products.filter(p => p.status === 'Proses Audit').length.toString(), color: 'text-gold' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
            <p className={cn('font-serif text-3xl font-bold', s.color)}>{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Cari nama produk atau kode QR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 shadow-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/15"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilter(!showFilter)}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors',
            showFilter
              ? 'border-gold/40 bg-gold/8 text-gold'
              : 'border-border bg-card text-foreground hover:bg-surface',
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showFilter && 'rotate-180')} />
        </button>
      </div>

      {/* Filter pills */}
      {showFilter && (
        <div className="mt-3 flex flex-wrap gap-2 animate-[fade-up_0.2s_ease_both]">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setFilterStatus(opt)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                filterStatus === opt
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-border bg-card text-muted-foreground hover:border-gold/30 hover:text-foreground',
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Product grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <div
            key={p.qr}
            className="card-lift group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-gold/30"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-serif text-base font-bold text-foreground">
                  {p.name}
                </p>
                <code className="mt-0.5 text-[11px] font-mono text-muted-foreground">
                  {p.qr}
                </code>
              </div>
              <StatusBadge status={p.status} />
            </div>

            {/* Material */}
            <p className="mt-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Material:</span> {p.material}
            </p>

            {/* Progress */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Progres Audit</span>
                <span className="text-[11px] font-semibold tabular-nums text-foreground">{p.progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    p.status === 'Terverifikasi'
                      ? 'bg-teal'
                      : p.status === 'Proses Audit'
                        ? 'bg-gold'
                        : 'bg-muted-foreground/30',
                  )}
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>

            {/* Date + actions */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{p.date}</span>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Link
                  href={`/dashboard/passport/${p.qr}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                  aria-label={`Lihat ${p.name}`}
                >
                  <Eye className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  disabled={p.status !== 'Terverifikasi'}
                  aria-label={`Unduh passport ${p.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <Package className="mx-auto h-10 w-10 text-border" />
            <p className="mt-4 font-serif text-lg font-semibold text-foreground">
              Tidak ada produk ditemukan
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Coba ubah kata kunci pencarian atau filter status
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
