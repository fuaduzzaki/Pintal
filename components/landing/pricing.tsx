import Link from 'next/link'
import { Check, ArrowRight, Zap } from 'lucide-react'

const INCLUDES = [
  'Material passport CSRD-compliant tanpa batas produk',
  'QR Code passport unik per produk',
  'Dashboard supply chain real-time',
  'Audit jaringan LSM & koperasi bersertifikat',
  'Laporan CSRD & EPR otomatis tiap kuartal',
  'Onboarding high-touch + dukungan auditor',
]

export function Pricing() {
  return (
    <section id="harga" className="scroll-mt-16 bg-background">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Harga
          </p>
          <h2 className="mt-4 text-balance font-serif text-3xl font-bold leading-tight tracking-tight text-foreground md:text-[2.5rem]">
            Satu langganan, kepatuhan tuntas.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Tidak ada biaya tersembunyi, tidak ada upsell. Yang Anda bayar adalah
            seluruh infrastruktur kepatuhan ekspor Anda.
          </p>
        </div>

        {/* Pricing card */}
        <div className="mx-auto mt-14 max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-black/6">
            {/* Gold accent top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-gold/40 via-gold to-gold/40" />

            <div className="md:grid md:grid-cols-5">
              {/* Left: price */}
              <div className="border-b border-border p-8 md:col-span-2 md:border-b-0 md:border-r">
                {/* Badge */}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/12 px-3 py-1 text-xs font-semibold text-gold">
                  <Zap className="h-3 w-3" />
                  Satu-satunya paket
                </span>

                <p className="mt-5 text-sm font-medium text-muted-foreground">
                  Langganan Brand
                </p>
                <div className="mt-2 flex items-end gap-1">
                  <span className="font-serif text-5xl font-bold tracking-tight text-foreground">
                    Rp&nbsp;2,5 jt
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">/brand/bulan</p>

                <div className="mt-4 rounded-xl bg-surface px-4 py-3">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Setara{' '}
                    <span className="font-semibold text-teal">94% lebih hemat</span>{' '}
                    vs sertifikasi manual Rp 80–200 juta.
                  </p>
                </div>

                {/* CTA as Link — no Button asChild */}
                <Link
                  href="/login"
                  className="group mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-md shadow-gold/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-gold/25"
                >
                  Mulai Gratis 14 Hari
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Tanpa kartu kredit. Batalkan kapan saja.
                </p>
              </div>

              {/* Right: features */}
              <div className="p-8 md:col-span-3">
                <p className="font-serif text-lg font-bold text-foreground">
                  Yang Anda dapatkan
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Semua yang Anda butuhkan untuk ekspor ke EU — dalam satu paket.
                </p>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {INCLUDES.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/12 text-teal">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm leading-[1.6] text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Guarantee */}
                <div className="mt-8 flex items-center gap-2 border-t border-border pt-6">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10">
                    <Check className="h-3.5 w-3.5 text-teal" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Garansi kepuasan 14 hari</span>
                    {' '}— jika tidak puas, kami kembalikan penuh.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
