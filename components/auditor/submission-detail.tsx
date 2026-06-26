'use client'

import type { ProductSubmission } from '@/lib/types'
import { MapPin, User } from 'lucide-react'

interface SubmissionDetailProps {
  submission: ProductSubmission
}

export function SubmissionDetail({ submission }: SubmissionDetailProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <h2 className="font-serif text-lg font-bold">Data Submission</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-muted-foreground">Nama Produk</dt><dd className="font-semibold">{submission.productName}</dd></div>
          <div><dt className="text-muted-foreground">Jenis</dt><dd className="font-semibold">{submission.productType}</dd></div>
          <div><dt className="text-muted-foreground">Asal Bahan Baku</dt><dd>{submission.materialOrigin}</dd></div>
          <div><dt className="text-muted-foreground">Jenis Serat</dt><dd>{submission.fiberType}</dd></div>
          <div><dt className="text-muted-foreground">Metode Pewarnaan</dt><dd>{submission.dyeMethod}</dd></div>
          <div><dt className="text-muted-foreground">Lokasi Pengrajin</dt><dd>{submission.geoLocation?.address}</dd></div>
        </dl>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Deskripsi Proses Produksi</p>
          <p className="text-sm leading-relaxed">{submission.productionProcess}</p>
        </div>
      </div>

      {submission.photos.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-serif text-base font-bold mb-3">Foto Bukti</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {submission.photos.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt="Foto bukti" className="aspect-square rounded-xl object-cover border border-border" />
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="font-serif text-base font-bold mb-3">Info Pengrajin</h3>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">{submission.artisanName}</p>
            <p className="text-muted-foreground inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {submission.geoLocation?.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
