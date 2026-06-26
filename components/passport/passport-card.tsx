import type { MaterialPassport } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

interface PassportCardProps {
  passport: MaterialPassport
}

export function PassportCard({ passport }: PassportCardProps) {
  const data = passport.passportData
  const shortId = passport.id.slice(0, 8).toUpperCase()

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm text-center">
        <h1 className="font-serif text-3xl font-bold text-foreground">{data.productName}</h1>
        <Badge className="mt-3" variant="outline">{data.productType}</Badge>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-2 text-sm font-semibold text-teal ring-1 ring-teal/20">
          <CheckCircle2 className="h-4 w-4" />
          CSRD-Compliant 2026
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-serif text-base font-bold mb-3">Asal Material</h2>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-muted-foreground">Asal bahan baku</dt><dd className="font-medium">{data.materialOrigin}</dd></div>
            <div><dt className="text-muted-foreground">Jenis serat</dt><dd>{data.fiberType}</dd></div>
            <div><dt className="text-muted-foreground">Metode pewarnaan</dt><dd>{data.dyeMethod}</dd></div>
          </dl>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-serif text-base font-bold mb-3">Pengrajin</h2>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-muted-foreground">Nama</dt><dd className="font-medium">{data.artisanName}</dd></div>
            <div><dt className="text-muted-foreground">Lokasi</dt><dd>{data.artisanLocation}</dd></div>
          </dl>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-serif text-base font-bold mb-3">Proses Verifikasi</h2>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-muted-foreground">Diverifikasi oleh</dt><dd className="font-medium">{data.auditedBy} — {data.auditorOrganization}</dd></div>
          <div><dt className="text-muted-foreground">Tanggal audit</dt><dd>{new Date(data.auditDate).toLocaleDateString('id-ID')}</dd></div>
          <div><dt className="text-muted-foreground">Nomor passport</dt><dd className="font-mono">{shortId}</dd></div>
          <div><dt className="text-muted-foreground">Valid hingga</dt><dd>{new Date(passport.expiresAt).toLocaleDateString('id-ID')}</dd></div>
        </dl>
      </section>

      {data.photos.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-serif text-base font-bold mb-1">Foto Bukti</h2>
          <p className="text-xs text-muted-foreground mb-3">Foto bukti diambil langsung dari proses produksi</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data.photos.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt="Foto bukti produksi" className="aspect-square rounded-xl object-cover border border-border" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
