'use client'

import { useState, useRef, useCallback } from 'react'
import { CheckCircle2, Upload, Camera, ArrowRight, ArrowLeft, Sparkles, X, FileText, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStoredProducts, saveStoredProducts, addAuditTask } from '@/lib/storage'
import { type Product } from '@/lib/dashboard-data'
import Link from 'next/link'

type Step = 1 | 2 | 3 | 4

const STEP_LABELS = [
  { n: 1, label: 'Info Produk' },
  { n: 2, label: 'Material' },
  { n: 3, label: 'Dokumen' },
  { n: 4, label: 'Review' },
]

const KATEGORI = ['Tenun', 'Batik', 'Lurik', 'Songket', 'Lainnya']
const PROVINSI = ['NTT', 'NTB', 'Jawa Tengah', 'Jawa Barat', 'Bali', 'Sulawesi', 'Sumatera', 'Lainnya']
const PROSES = ['Tenun ATBM', 'Batik Tulis', 'Pewarna Alam', 'Fair Trade', 'Organik Certified']

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

type UploadedFile = {
  file: File
  preview: string | null // null for PDF
  error?: string
}

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEP_LABELS.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300',
                current > s.n
                  ? 'border-teal bg-teal text-white'
                  : current === s.n
                    ? 'border-gold bg-gold text-white shadow-lg shadow-gold/30'
                    : 'border-border bg-surface text-muted-foreground',
              )}
            >
              {current > s.n ? <CheckCircle2 className="h-4 w-4" /> : s.n}
            </div>
            <span
              className={cn(
                'hidden text-[10px] font-medium sm:block',
                current === s.n ? 'text-gold' : current > s.n ? 'text-teal' : 'text-muted-foreground',
              )}
            >
              {s.label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div
              className={cn(
                'h-0.5 w-12 sm:w-20 mx-1 transition-all duration-500 mb-3',
                current > s.n + 1 ? 'bg-teal' : current > s.n ? 'bg-gradient-to-r from-teal to-border' : 'bg-border',
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function UploadZone({
  label,
  icon,
  uploadKey,
  uploads,
  onUpload,
  onRemove,
}: {
  label: string
  icon: React.ReactNode
  uploadKey: string
  uploads: Record<string, UploadedFile[]>
  onUpload: (key: string, files: FileList) => void
  onRemove: (key: string, index: number) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const fileList = uploads[uploadKey] ?? []

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) {
        onUpload(uploadKey, e.dataTransfer.files)
      }
    },
    [uploadKey, onUpload],
  )

  const handleClick = () => inputRef.current?.click()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(uploadKey, e.target.files)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 select-none',
          isDragging
            ? 'border-gold bg-gold/10 scale-[1.01]'
            : fileList.length > 0
              ? 'border-teal/40 bg-teal/5 hover:border-teal/60'
              : 'border-border bg-surface hover:border-gold/50 hover:bg-gold/5',
        )}
      >
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition-colors',
            isDragging ? 'bg-gold/20 text-gold' : fileList.length > 0 ? 'bg-teal/10 text-teal' : 'bg-card text-muted-foreground',
          )}
        >
          {fileList.length > 0 ? <CheckCircle2 className="h-6 w-6" /> : icon}
        </div>
        <p className={cn('text-sm font-medium', fileList.length > 0 ? 'text-teal' : 'text-foreground')}>
          {fileList.length > 0 ? `${fileList.length} file dipilih` : label}
        </p>
        <p className="text-xs text-muted-foreground">
          {isDragging ? 'Lepaskan file di sini' : 'Klik atau seret file ke sini'}
        </p>
        <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          JPG, PNG, PDF maks 10MB
        </span>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={handleChange}
        aria-hidden
      />

      {/* File previews */}
      {fileList.length > 0 && (
        <div className="space-y-2">
          {fileList.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-center gap-3 rounded-xl border bg-card p-3 transition-all animate-[fade-up_0.2s_ease_both]',
                item.error ? 'border-red-200 bg-red-50' : 'border-border',
              )}
            >
              {/* Thumbnail or icon */}
              {item.preview ? (
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.preview} alt={item.file.name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground">
                  {item.file.type === 'application/pdf' ? (
                    <FileText className="h-6 w-6 text-red-400" />
                  ) : (
                    <ImageIcon className="h-6 w-6" />
                  )}
                </div>
              )}

              {/* File info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">{item.file.name}</p>
                {item.error ? (
                  <p className="text-[10px] text-red-500">{item.error}</p>
                ) : (
                  <p className="text-[10px] text-muted-foreground">
                    {(item.file.size / 1024).toFixed(0)} KB
                  </p>
                )}
              </div>

              {/* Status badge */}
              {!item.error && (
                <span className="shrink-0 rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-semibold text-teal">
                  Siap
                </span>
              )}

              {/* Remove button */}
              <button
                type="button"
                aria-label="Hapus file"
                onClick={(e) => { e.stopPropagation(); onRemove(uploadKey, idx) }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function NewPassportPage() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState({
    nama: '',
    kategori: '',
    sku: '',
    deskripsi: '',
    bahan: '',
    komposisi: '',
    provinsi: '',
    proses: [] as string[],
    catatan: '',
  })
  const [uploads, setUploads] = useState<Record<string, UploadedFile[]>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const toggleProses = (p: string) => {
    setForm((prev) => ({
      ...prev,
      proses: prev.proses.includes(p)
        ? prev.proses.filter((x) => x !== p)
        : [...prev.proses, p],
    }))
  }

  const handleUpload = useCallback((key: string, files: FileList) => {
    const newEntries: UploadedFile[] = Array.from(files).map((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        return { file, preview: null, error: 'Tipe file tidak didukung (gunakan JPG, PNG, atau PDF)' }
      }
      if (file.size > MAX_FILE_SIZE) {
        return { file, preview: null, error: 'File melebihi batas 10MB' }
      }
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      return { file, preview }
    })
    setUploads((prev) => ({ ...prev, [key]: [...(prev[key] ?? []), ...newEntries] }))
  }, [])

  const handleRemove = useCallback((key: string, index: number) => {
    setUploads((prev) => {
      const updated = [...(prev[key] ?? [])]
      const removed = updated.splice(index, 1)[0]
      if (removed?.preview) URL.revokeObjectURL(removed.preview)
      return { ...prev, [key]: updated }
    })
  }, [])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Save product to localStorage
    const products = getStoredProducts()
    const generatedQr = form.sku || `${Math.floor(100 + Math.random() * 900)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${form.kategori.substring(0, 3).toUpperCase() || 'PRD'}-${Math.floor(1000 + Math.random() * 9000)}`
    
    const newProduct = {
      name: form.nama || 'Produk Baru',
      qr: generatedQr,
      material: form.bahan || 'Katun',
      status: 'Menunggu Input',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      progress: 10,
      category: form.kategori || 'Lainnya',
      sku: form.sku,
      description: form.deskripsi,
      bahan: form.bahan,
      komposisi: form.komposisi,
      provinsi: form.provinsi,
      proses: form.proses,
      catatan: form.catatan
    }
    
    saveStoredProducts([newProduct as any, ...products])

    // Auto-create audit task for verifikator queue
    addAuditTask({
      id: `TASK-${Date.now()}`,
      productName: form.nama || 'Produk Baru',
      productQr: generatedQr,
      brandName: 'Sanggar Wastra Nusantara',
      brandEmail: 'arini@sanggarwastra.id',
      material: form.bahan || 'Katun',
      provinsi: form.provinsi || '—',
      proses: form.proses,
      komposisi: form.komposisi || '—',
      description: form.deskripsi || '',
      category: form.kategori || 'Lainnya',
      submittedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Menunggu Review',
      progress: 10,
      checklistItems: [
        { id: 'dok_pengrajin',      label: 'Dokumen pengrajin lengkap & valid',  checked: false },
        { id: 'foto_produk',        label: 'Foto produk sesuai deskripsi',        checked: false },
        { id: 'bahan_terverifikasi',label: 'Bahan baku terverifikasi asal usulnya', checked: false },
        { id: 'proses_produksi',    label: 'Proses produksi sesuai standar',     checked: false },
        { id: 'pewarna_aman',       label: 'Pewarna aman & ramah lingkungan',    checked: false },
        { id: 'kunjungan_lapangan', label: 'Kunjungan lapangan telah dilakukan', checked: false },
        { id: 'data_pengrajin',     label: 'Data pengrajin sudah diinput & valid', checked: false },
      ],
    })

    await new Promise((r) => setTimeout(r, 1200))
    setIsSubmitting(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-5 py-16 text-center">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal/10 ring-8 ring-teal/5">
            <CheckCircle2 className="h-12 w-12 text-teal" />
          </div>
          <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-white shadow-lg">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
        <h1 className="mt-8 font-serif text-3xl font-bold text-foreground">
          Passport Berhasil Dikirim!
        </h1>
        <p className="mt-3 max-w-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{form.nama || 'Produk baru'}</span> sudah masuk antrian audit LSM. Passport akan terbit dalam <span className="font-semibold text-foreground">72 jam kerja</span>.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/products"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
          >
            Lihat Produk &amp; Passport
          </Link>
          <button
            type="button"
            onClick={() => { setDone(false); setStep(1); setForm({ nama: '', kategori: '', sku: '', deskripsi: '', bahan: '', komposisi: '', provinsi: '', proses: [], catatan: '' }); setUploads({}) }}
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-surface transition-colors"
          >
            Tambah Produk Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          Material Passport Baru
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Tambah Material Passport
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Lengkapi data produk untuk memulai proses verifikasi audit LSM
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* Form card */}
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8 animate-[fade-up_0.3s_ease_both]">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Langkah {step} dari 4
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold text-foreground">
              {STEP_LABELS[step - 1].label}
            </h2>
          </div>

          {/* Step 1: Info Produk */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Nama Produk <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="cth. Tenun Ikat Sumba Premium"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 shadow-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Kategori Produk <span className="text-gold">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {KATEGORI.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setForm({ ...form, kategori: k })}
                      className={cn(
                        'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all',
                        form.kategori === k
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-border bg-surface text-muted-foreground hover:border-gold/40 hover:text-foreground',
                      )}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Kode SKU / Referensi
                </label>
                <input
                  type="text"
                  placeholder="cth. SKU-TIS-2026-001"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 shadow-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Deskripsi Singkat
                </label>
                <textarea
                  placeholder="Ceritakan singkat tentang produk ini..."
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 shadow-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/15"
                />
              </div>
            </div>
          )}

          {/* Step 2: Material */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Jenis Bahan Utama <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="cth. Benang Katun Organik, Sutra Alam"
                  value={form.bahan}
                  onChange={(e) => setForm({ ...form, bahan: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 shadow-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Persentase Komposisi
                </label>
                <input
                  type="text"
                  placeholder="cth. 100% Katun, 70% Sutra + 30% Katun"
                  value={form.komposisi}
                  onChange={(e) => setForm({ ...form, komposisi: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 shadow-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Asal Sumber / Provinsi <span className="text-gold">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROVINSI.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({ ...form, provinsi: p })}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-sm font-medium transition-all',
                        form.provinsi === p
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-border bg-surface text-muted-foreground hover:border-gold/40 hover:text-foreground',
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Proses Produksi (pilih semua yang sesuai)
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROSES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggleProses(p)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-sm font-medium transition-all',
                        form.proses.includes(p)
                          ? 'border-teal bg-teal/10 text-teal'
                          : 'border-border bg-surface text-muted-foreground hover:border-teal/40 hover:text-foreground',
                      )}
                    >
                      {form.proses.includes(p) && <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload dokumentasi untuk proses verifikasi LSM. File yang lebih lengkap mempercepat verifikasi.
              </p>
              <UploadZone
                label="Foto Produk"
                icon={<Camera className="h-6 w-6" />}
                uploadKey="foto_produk"
                uploads={uploads}
                onUpload={handleUpload}
                onRemove={handleRemove}
              />
              <UploadZone
                label="Surat Keterangan Pengrajin"
                icon={<Upload className="h-6 w-6" />}
                uploadKey="surat_pengrajin"
                uploads={uploads}
                onUpload={handleUpload}
                onRemove={handleRemove}
              />
              <UploadZone
                label="Foto Proses Produksi"
                icon={<Camera className="h-6 w-6" />}
                uploadKey="foto_proses"
                uploads={uploads}
                onUpload={handleUpload}
                onRemove={handleRemove}
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Catatan Tambahan (opsional)
                </label>
                <textarea
                  placeholder="Informasi tambahan untuk auditor LSM..."
                  value={form.catatan}
                  onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 shadow-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/15"
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Periksa kembali data sebelum mengirimkan ke antrian audit LSM.
              </p>
              <div className="rounded-xl border border-border bg-surface divide-y divide-border">
                {[
                  { label: 'Nama Produk', value: form.nama || '—' },
                  { label: 'Kategori', value: form.kategori || '—' },
                  { label: 'Kode SKU', value: form.sku || '—' },
                  { label: 'Bahan Utama', value: form.bahan || '—' },
                  { label: 'Komposisi', value: form.komposisi || '—' },
                  { label: 'Asal Provinsi', value: form.provinsi || '—' },
                  { label: 'Proses', value: form.proses.join(', ') || '—' },
                  {
                    label: 'Dokumen',
                    value: [
                      (uploads['foto_produk']?.filter(f => !f.error).length ?? 0) > 0 && `${uploads['foto_produk'].filter(f => !f.error).length} foto produk`,
                      (uploads['surat_pengrajin']?.filter(f => !f.error).length ?? 0) > 0 && `${uploads['surat_pengrajin'].filter(f => !f.error).length} surat pengrajin`,
                      (uploads['foto_proses']?.filter(f => !f.error).length ?? 0) > 0 && `${uploads['foto_proses'].filter(f => !f.error).length} foto proses`,
                    ].filter(Boolean).join(', ') || '—',
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4 px-4 py-3">
                    <span className="text-sm text-muted-foreground shrink-0">{row.label}</span>
                    <span className="text-sm font-medium text-foreground text-right">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-teal/20 bg-teal/5 p-4 text-sm text-muted-foreground">
                <p>✓ Setelah dikirim, passport akan masuk antrian audit LSM dalam waktu <strong className="text-foreground">72 jam kerja</strong>.</p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => step > 1 && setStep((prev) => (prev - 1) as Step)}
              disabled={step === 1}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev + 1) as Step)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-gold/20 transition-all hover:bg-primary/90 hover:gap-3"
              >
                Lanjut
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-gold/20 transition-all hover:bg-primary/90 disabled:opacity-70"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim ke Audit LSM'}
                {!isSubmitting && <Sparkles className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
