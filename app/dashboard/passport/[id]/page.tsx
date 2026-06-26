'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getStoredProducts } from '@/lib/storage'
import {
  ArrowLeft,
  Download,
  Share2,
  QrCode,
  CheckCircle2,
  Clock,
  Leaf,
  Shirt,
  FileText,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'

const PASSPORT = {
  id: '9F2A-SUMBA-0042',
  name: 'Tenun Ikat Sumba',
  category: 'Tenun Tradisional',
  status: 'Terverifikasi' as const,
  material: 'Katun pewarna alam',
  origin: 'Waingapu, NTT',
  craftsman: 'Ibu Maria Mbiri',
  carbon: '0.8 kg CO₂e / pcs',
  createdAt: '12 Mei 2026',
  verifiedAt: '18 Mei 2026',
  validUntil: '18 Mei 2027',
  url: 'pintal.id/p/9F2A-SUMBA-0042',
}

const SUPPLY_CHAIN = [
  {
    step: 'Petani',
    desc: 'Kapas organik ditanam oleh petani lokal tanpa pestisida kimia',
    date: '10 Mar 2026',
    location: 'Sumba Timur, NTT',
    done: true,
  },
  {
    step: 'Penenun',
    desc: 'Proses tenun ikat tradisional menggunakan alat tenun bukan mesin (ATBM)',
    date: '20 Mar 2026',
    location: 'Waingapu, NTT',
    done: true,
  },
  {
    step: 'Celup (Natural Indigo)',
    desc: 'Pewarnaan menggunakan bahan alami — indigo alam dan kunyit tanpa bahan kimia sintetis',
    date: '05 Apr 2026',
    location: 'Workshop Ibu Maria Mbiri',
    done: true,
  },
  {
    step: 'Quality Control',
    desc: 'Inspeksi kualitas oleh auditor LSM Tunas Nusantara — verifikasi dokumen dan produk',
    date: '28 Apr 2026',
    location: 'Kupang, NTT',
    done: true,
  },
  {
    step: 'Export Ready',
    desc: 'Passport terbit, produk siap ekspor ke pasar EU/AS dengan dokumentasi CSRD lengkap',
    date: '18 Mei 2026',
    location: 'Jakarta — Export Hub',
    done: true,
  },
]

const MATERIALS = [
  { label: 'Jenis Material', value: 'Benang Katun Organik', icon: Shirt },
  { label: 'Komposisi', value: '100% Katun Alam', icon: Leaf },
  { label: 'Asal Sumber', value: 'Sumba Timur, NTT', icon: CheckCircle2 },
  { label: 'Proses Produksi', value: 'Tenun ATBM + Celup Alam', icon: Clock },
  { label: 'Sertifikasi', value: 'GOTS Organic, LSM Verified', icon: ShieldCheck },
  { label: 'Jejak Karbon', value: '0.8 kg CO₂e / pcs', icon: Leaf },
]

const DOCUMENTS = [
  {
    name: 'Surat Keterangan Pengrajin',
    type: 'PDF',
    size: '245 KB',
    date: '20 Mar 2026',
    verified: true,
  },
  {
    name: 'Laporan Kunjungan LSM Tunas Nusantara',
    type: 'PDF',
    size: '1.2 MB',
    date: '28 Apr 2026',
    verified: true,
  },
  {
    name: 'Foto Dokumentasi Proses',
    type: 'ZIP',
    size: '8.4 MB',
    date: '05 Apr 2026',
    verified: true,
  },
]

type Tab = 'rantai-pasok' | 'material' | 'dokumen'

export default function PassportDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [activeTab, setActiveTab] = useState<Tab>('rantai-pasok')
  const [passport, setPassport] = useState<any>(null)

  useEffect(() => {
    const products = getStoredProducts()
    const p = products.find((x) => x.qr === id)
    if (p) {
      setPassport({
        id: p.qr,
        name: p.name,
        category: (p as any).category || 'Tenun Tradisional',
        status: p.status,
        material: p.material,
        origin: (p as any).provinsi || 'Waingapu, NTT',
        craftsman: 'Ibu Maria Mbiri',
        carbon: '0.8 kg CO₂e / pcs',
        createdAt: p.date,
        verifiedAt: p.status === 'Terverifikasi' ? '18 Mei 2026' : '—',
        validUntil: p.status === 'Terverifikasi' ? '18 Mei 2027' : '—',
        url: `pintal.id/p/${p.qr}`,
        description: (p as any).description || '',
        komposisi: (p as any).komposisi || '100% Katun Alam',
        proses: (p as any).proses && (p as any).proses.length > 0 ? (Array.isArray((p as any).proses) ? (p as any).proses.join(', ') : (p as any).proses) : 'Tenun ATBM + Celup Alam',
        catatan: (p as any).catatan || '',
      })
    } else {
      // Fallback/Default mock if no product found
      setPassport({
        id: '9F2A-SUMBA-0042',
        name: 'Tenun Ikat Sumba',
        category: 'Tenun Tradisional',
        status: 'Terverifikasi' as const,
        material: 'Katun pewarna alam',
        origin: 'Waingapu, NTT',
        craftsman: 'Ibu Maria Mbiri',
        carbon: '0.8 kg CO₂e / pcs',
        createdAt: '12 Mei 2026',
        verifiedAt: '18 Mei 2026',
        validUntil: '18 Mei 2027',
        url: 'pintal.id/p/9F2A-SUMBA-0042',
        description: '',
        komposisi: '100% Katun Alam',
        proses: 'Tenun ATBM + Celup Alam',
        catatan: '',
      })
    }
  }, [id])

  if (!passport) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Memuat data passport...</p>
      </div>
    )
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'rantai-pasok', label: 'Rantai Pasok' },
    { key: 'material', label: 'Material' },
    { key: 'dokumen', label: 'Dokumen Audit' },
  ]

  const materials = [
    { label: 'Jenis Material', value: passport.material, icon: Shirt },
    { label: 'Komposisi', value: passport.komposisi, icon: Leaf },
    { label: 'Asal Sumber', value: passport.origin, icon: CheckCircle2 },
    { label: 'Proses Produksi', value: passport.proses, icon: Clock },
    { label: 'Sertifikasi', value: passport.status === 'Terverifikasi' ? 'GOTS Organic, LSM Verified' : 'Belum Diverifikasi', icon: ShieldCheck },
    { label: 'Jejak Karbon', value: passport.carbon, icon: Leaf },
  ]

  const supplyChain = SUPPLY_CHAIN.map((step, idx) => {
    let done = true
    if (passport.status === 'Menunggu Input' && idx > 0) done = false
    if (passport.status === 'Proses Audit' && idx > 2) done = false
    return { ...step, done }
  })

  const documents = DOCUMENTS.map((doc) => {
    let verified = true
    if (passport.status !== 'Terverifikasi') verified = false
    return { ...doc, verified }
  })

  return (
    <div className="px-5 py-8 md:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/dashboard/products" className="hover:text-foreground transition-colors">Produk</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate">{passport.name}</span>
      </div>

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/dashboard/products"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
              passport.status === 'Terverifikasi'
                ? 'bg-teal/10 text-teal ring-1 ring-teal/20'
                : passport.status === 'Proses Audit'
                  ? 'bg-gold/12 text-gold ring-1 ring-gold/20'
                  : 'bg-surface text-muted-foreground ring-1 ring-border'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                passport.status === 'Terverifikasi'
                  ? 'bg-teal animate-pulse'
                  : passport.status === 'Proses Audit'
                    ? 'bg-gold'
                    : 'bg-muted-foreground'
              }`} />
              {passport.status}
            </span>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {passport.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {passport.category} · {passport.origin}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-surface transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            Bagikan
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Unduh PDF
          </button>
        </div>
      </div>

      {/* Main 2-col layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: tabs content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab bar */}
          <div className="flex rounded-xl border border-border bg-card p-1 shadow-sm w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-foreground text-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Rantai Pasok */}
          {activeTab === 'rantai-pasok' && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-[fade-up_0.3s_ease_both]">
              <h2 className="font-serif text-xl font-bold text-foreground mb-6">
                Timeline Rantai Pasok
              </h2>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[18px] top-6 bottom-6 w-px bg-gradient-to-b from-teal via-border to-teal/30" />

                <div className="space-y-6">
                  {supplyChain.map((s, i) => (
                    <div key={s.step} className="relative flex gap-4 animate-[fade-up_0.4s_ease_both]" style={{ animationDelay: `${i * 0.08}s` }}>
                      {/* Dot */}
                      <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 shadow-sm ${
                        s.done
                          ? 'border-teal bg-teal text-white'
                          : 'border-border bg-card text-muted-foreground'
                      }`}>
                        {s.done ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h3 className="font-semibold text-foreground">{s.step}</h3>
                          <span className="text-xs text-muted-foreground">{s.date}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                        <p className="mt-1 text-xs text-muted-foreground/70">📍 {s.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Material */}
          {activeTab === 'material' && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-[fade-up_0.3s_ease_both]">
              <h2 className="font-serif text-xl font-bold text-foreground mb-6">
                Informasi Material
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {materials.map((m) => (
                  <div
                    key={m.label}
                    className="card-lift rounded-xl border border-border bg-surface p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/10 text-gold">
                        <m.icon className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                        {m.label}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Carbon footprint highlight */}
              <div className="mt-4 rounded-xl border border-teal/20 bg-teal/5 p-4">
                <div className="flex items-center gap-3">
                  <Leaf className="h-5 w-5 text-teal shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Jejak Karbon Rendah</p>
                    <p className="text-sm text-muted-foreground">
                      0.8 kg CO₂e / pcs — 60% lebih rendah dari rata-rata industri fashion global
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Dokumen */}
          {activeTab === 'dokumen' && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-[fade-up_0.3s_ease_both]">
              <h2 className="font-serif text-xl font-bold text-foreground mb-6">
                Dokumen Audit
              </h2>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.name}
                    className="group flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition-all hover:border-gold/30"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/8">
                        <FileText className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type} · {doc.size} · {doc.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {doc.verified && (
                        <span className="hidden items-center gap-1 rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-semibold text-teal sm:inline-flex">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      )}
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/5 p-3 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                Semua dokumen telah diverifikasi oleh LSM Tunas Nusantara
              </div>
            </div>
          )}
        </div>

        {/* Right: QR sidebar */}
        <div className="space-y-4">
          {/* QR Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm text-center">
            {/* QR placeholder */}
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg">
              <QrCode className="h-20 w-20" />
            </div>
            <p className="mt-4 font-mono text-sm font-semibold text-foreground">{passport.id}</p>
            <a
              href={`https://${passport.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors"
            >
              {passport.url}
              <ExternalLink className="h-3 w-3" />
            </a>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Download className="inline h-3.5 w-3.5 mr-1.5" />
                Unduh QR Code
              </button>
              <button
                type="button"
                className="w-full rounded-xl border border-border py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors"
              >
                <Share2 className="inline h-3.5 w-3.5 mr-1.5" />
                Bagikan Link
              </button>
            </div>
          </div>

          {/* Dates */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="font-serif text-base font-bold text-foreground mb-3">Tanggal Penting</h3>
            <div className="space-y-3">
              {[
                { label: 'Dibuat', value: passport.createdAt },
                { label: 'Terverifikasi', value: passport.verifiedAt },
                { label: 'Berlaku hingga', value: passport.validUntil },
              ].map((d) => (
                <div key={d.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{d.label}</span>
                  <span className="text-sm font-semibold text-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CSRD Badge */}
          <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-gold" />
              <h3 className="font-semibold text-foreground">CSRD Compliant</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Passport ini memenuhi persyaratan EU Corporate Sustainability Reporting Directive (CSRD) Annex IV dan EPR regulations.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['CSRD Annex IV', 'EPR Ready', 'ISO 14001'].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-gold/30 bg-gold/8 px-2.5 py-0.5 text-[10px] font-semibold text-gold"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
