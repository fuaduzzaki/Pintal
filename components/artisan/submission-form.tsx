'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { PhotoUpload, type UploadedPhoto } from '@/components/artisan/photo-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { ProductSubmission } from '@/lib/types'

const PRODUCT_TYPES = ['Tenun', 'Batik', 'Lurik', 'Songket', 'Jumputan', 'Lainnya'] as const
const STEPS = ['Info Produk', 'Upload Foto', 'Review & Kirim']

export function SubmissionForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [form, setForm] = useState({
    productName: '',
    productType: '' as ProductSubmission['productType'] | '',
    materialOrigin: '',
    fiberType: '',
    dyeMethod: '',
    productionProcess: '',
    location: '',
  })

  const canProceedStep1 =
    form.productName &&
    form.productType &&
    form.materialOrigin &&
    form.fiberType &&
    form.dyeMethod &&
    form.productionProcess.length >= 50 &&
    form.location

  const canProceedStep2 = photos.length >= 2

  const handleSubmit = async () => {
    if (!confirmed) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          productType: form.productType,
          photos: photos.map((p) => p.url),
          geoLocation: { lat: 0, lng: 0, address: form.location },
        }),
      })
      if (!res.ok) throw new Error('Gagal submit')
      toast.success('Data berhasil dikirim! Menunggu verifikasi auditor LSM.')
      router.push('/artisan')
    } catch {
      toast.error('Gagal mengirim data. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                  i <= step ? 'bg-primary text-primary-foreground' : 'bg-surface text-muted-foreground',
                )}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className="hidden text-[10px] font-medium text-muted-foreground sm:block">{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('mx-2 h-0.5 flex-1', i < step ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 0 && (
        <div className="space-y-4 animate-[fade-up_0.3s_ease_both]">
          <h1 className="font-serif text-2xl font-bold">Info Produk</h1>
          <div className="space-y-2">
            <Label htmlFor="productName">Nama Produk *</Label>
            <Input id="productName" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} placeholder="Tenun Ikat Sumba Premium" />
          </div>
          <div className="space-y-2">
            <Label>Jenis Produk *</Label>
            <Select value={form.productType} onValueChange={(v) => setForm({ ...form, productType: v as ProductSubmission['productType'] })}>
              <SelectTrigger><SelectValue placeholder="Pilih jenis produk" /></SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="materialOrigin">Asal Bahan Baku *</Label>
            <Input id="materialOrigin" value={form.materialOrigin} onChange={(e) => setForm({ ...form, materialOrigin: e.target.value })} placeholder="Jepara, Jawa Tengah" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fiberType">Jenis Serat *</Label>
            <Input id="fiberType" value={form.fiberType} onChange={(e) => setForm({ ...form, fiberType: e.target.value })} placeholder="Katun organik, sutra alam" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dyeMethod">Metode Pewarnaan *</Label>
            <Input id="dyeMethod" value={form.dyeMethod} onChange={(e) => setForm({ ...form, dyeMethod: e.target.value })} placeholder="Pewarna alami indigo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productionProcess">Deskripsi Proses Produksi * (min. 50 karakter)</Label>
            <Textarea id="productionProcess" rows={4} value={form.productionProcess} onChange={(e) => setForm({ ...form, productionProcess: e.target.value })} placeholder="Jelaskan proses produksi secara detail..." />
            <p className="text-xs text-muted-foreground">{form.productionProcess.length}/50 karakter</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi Pengrajin *</Label>
            <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Waingapu, NTT" />
          </div>
          <Button className="w-full rounded-full" disabled={!canProceedStep1} onClick={() => setStep(1)}>
            Lanjut <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 2 */}
      {step === 1 && (
        <div className="space-y-4 animate-[fade-up_0.3s_ease_both]">
          <h1 className="font-serif text-2xl font-bold">Upload Foto</h1>
          <PhotoUpload photos={photos} onChange={setPhotos} />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-full" onClick={() => setStep(0)}>
              <ArrowLeft className="h-4 w-4" /> Kembali
            </Button>
            <Button className="flex-1 rounded-full" disabled={!canProceedStep2} onClick={() => setStep(2)}>
              Lanjut <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 2 && (
        <div className="space-y-4 animate-[fade-up_0.3s_ease_both]">
          <h1 className="font-serif text-2xl font-bold">Review & Kirim</h1>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3 text-sm">
            <div className="grid gap-2 sm:grid-cols-2">
              <div><span className="text-muted-foreground">Nama:</span> <strong>{form.productName}</strong></div>
              <div><span className="text-muted-foreground">Jenis:</span> <strong>{form.productType}</strong></div>
              <div><span className="text-muted-foreground">Asal Bahan:</span> <strong>{form.materialOrigin}</strong></div>
              <div><span className="text-muted-foreground">Serat:</span> <strong>{form.fiberType}</strong></div>
              <div><span className="text-muted-foreground">Pewarnaan:</span> <strong>{form.dyeMethod}</strong></div>
              <div><span className="text-muted-foreground">Lokasi:</span> <strong>{form.location}</strong></div>
            </div>
            <p className="text-muted-foreground">Proses: {form.productionProcess}</p>
            <div className="flex gap-2 flex-wrap">
              {photos.map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={p.url} src={p.preview} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ))}
            </div>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 h-4 w-4 accent-primary" />
            <span className="text-sm text-muted-foreground">
              Saya menyatakan data di atas adalah benar dan dapat diverifikasi
            </span>
          </label>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-full" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4" /> Kembali
            </Button>
            <Button className="flex-1 rounded-full" disabled={!confirmed || submitting} onClick={handleSubmit}>
              {submitting ? 'Mengirim...' : 'Kirim untuk Audit'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
