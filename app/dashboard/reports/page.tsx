'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  Download,
  Eye,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Info,
  Sparkles,
} from 'lucide-react'
import { getStoredProducts, getStoredReports, saveStoredReports, type Report } from '@/lib/storage'

const FORMATS = ['PDF', 'Excel']
const STANDARDS = ['CSRD Annex IV', 'EPR Regulation', 'Keduanya']

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [availableProducts, setAvailableProducts] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [format, setFormat] = useState('PDF')
  const [standard, setStandard] = useState('CSRD Annex IV')
  const [isGenerating, setIsGenerating] = useState(false)
  const [justGenerated, setJustGenerated] = useState(false)

  useEffect(() => {
    setReports(getStoredReports())
    const products = getStoredProducts()
    setAvailableProducts(products.map((p) => p.name))
  }, [])

  const toggleProduct = (p: string) => {
    setSelectedProducts((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    )
  }

  const handleGenerate = async () => {
    if (selectedProducts.length === 0) return
    setIsGenerating(true)
    await new Promise((r) => setTimeout(r, 2000))

    const now = new Date()
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    const standardLabel = standard === 'Keduanya' ? 'CSRD & EPR' : standard
    const newReport: Report = {
      id: Date.now(),
      name: `${standardLabel} — ${selectedProducts.slice(0, 2).join(' & ')}${selectedProducts.length > 2 ? ` +${selectedProducts.length - 2}` : ''}`,
      date: dateStr,
      products: selectedProducts.length,
      format,
      status: 'Selesai',
      size: `${(0.5 + Math.random() * 3).toFixed(1)} MB`,
    }

    const updatedReports = [newReport, ...reports]
    saveStoredReports(updatedReports)
    setReports(updatedReports)
    setSelectedProducts([])
    setIsGenerating(false)
    setJustGenerated(true)
    setTimeout(() => setJustGenerated(false), 3000)
  }

  return (
    <div className="px-5 py-8 md:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <FileText className="h-4 w-4" />
            <span>Dashboard / Laporan CSRD & EPR</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Laporan CSRD & EPR
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate dan kelola laporan kepatuhan ekspor untuk buyer EU
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-gold/20 hover:bg-primary/90 transition-all"
        >
          <Plus className="h-4 w-4" />
          Generate Laporan
        </button>
      </div>

      {/* Success banner */}
      {justGenerated && (
        <div className="mb-6 rounded-2xl border border-teal/30 bg-teal/8 p-4 flex items-center gap-3 animate-[fade-up_0.3s_ease_both]">
          <CheckCircle2 className="h-5 w-5 text-teal shrink-0" />
          <p className="text-sm font-medium text-foreground">Laporan berhasil dibuat dan ditambahkan ke daftar!</p>
        </div>
      )}

      {/* Info banner */}
      <div className="mb-8 rounded-2xl border border-gold/25 bg-gradient-to-r from-gold/10 via-gold/6 to-transparent p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Tentang Laporan CSRD</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              EU Corporate Sustainability Reporting Directive (CSRD) mewajibkan brand yang ekspor ke EU untuk melaporkan dampak lingkungan dan sosial rantai pasok mereka.
              Pintal menghasilkan laporan Annex IV dan EPR yang diakui buyer EU secara otomatis dari data Material Passport Anda.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Berlaku mulai 2024', 'Denda s/d €10 juta', 'Wajib untuk ekspor EU'].map((tag) => (
                <span key={tag} className="rounded-full border border-gold/30 bg-gold/8 px-2.5 py-0.5 text-[11px] font-semibold text-gold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two-col layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: existing reports */}
        <div className="lg:col-span-2">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            Laporan Tersedia
          </h2>
          {reports.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
              <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Belum ada laporan. Generate laporan pertama Anda!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="card-lift group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-gold/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${
                        r.status === 'Selesai' ? 'bg-teal/10 text-teal' : 'bg-gold/10 text-gold'
                      }`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{r.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{r.date}</span>
                          <span>·</span>
                          <span>{r.products} produk</span>
                          <span>·</span>
                          <span>{r.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        r.status === 'Selesai'
                          ? 'bg-teal/10 text-teal ring-1 ring-teal/20'
                          : 'bg-gold/10 text-gold ring-1 ring-gold/20'
                      }`}>
                        {r.status === 'Selesai'
                          ? <><CheckCircle2 className="h-3 w-3" /> Selesai</>
                          : <><Clock className="h-3 w-3" /> Draft</>
                        }
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-mono text-muted-foreground">{r.format}</span>
                    <div className="flex-1" />
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
                      aria-label="Preview laporan"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={r.status === 'Draft'}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Unduh
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: generate form */}
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            Generate Laporan Baru
          </h2>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-5">
            {/* Product selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Pilih Produk
              </label>
              {availableProducts.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Belum ada produk terdaftar.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableProducts.map((p) => (
                    <label
                      key={p}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm transition-all hover:border-gold/30"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(p)}
                        onChange={() => toggleProduct(p)}
                        className="accent-[#bf8a44]"
                      />
                      <span className="font-medium text-foreground truncate">{p}</span>
                    </label>
                  ))}
                </div>
              )}
              {selectedProducts.length > 0 && (
                <p className="mt-1.5 text-xs text-teal">
                  {selectedProducts.length} produk dipilih
                </p>
              )}
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Format</label>
              <div className="flex gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-all ${
                      format === f
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-border bg-surface text-muted-foreground hover:border-gold/30'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Standard */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Standar Laporan</label>
              <div className="space-y-2">
                {STANDARDS.map((s) => (
                  <label
                    key={s}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm transition-all hover:border-gold/30"
                  >
                    <input
                      type="radio"
                      name="standard"
                      value={s}
                      checked={standard === s}
                      onChange={() => setStandard(s)}
                      className="accent-[#bf8a44]"
                    />
                    <span className="font-medium text-foreground">{s}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || selectedProducts.length === 0}
              className="group w-full overflow-hidden rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-gold/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 relative"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              {isGenerating ? (
                'Membuat Laporan...'
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Sekarang
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              Format: {format} · Standar: {standard}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
