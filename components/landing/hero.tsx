import Link from 'next/link'
import { ArrowRight, ShieldCheck, CheckCircle2, QrCode, Sparkles, PlayCircle } from 'lucide-react'

export function Hero() {
  return (
    <section className="grain relative overflow-hidden bg-background">
      {/* Ambient background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-gold/6 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-teal/5 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 pb-20 pt-16 md:grid-cols-2 md:px-8 md:pb-28 md:pt-24">
        {/* ── Copy ─────────────────────────────────── */}
        <div className="flex flex-col items-start animate-[fade-up_0.7s_ease_both]">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/8 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-teal">
            <ShieldCheck className="h-3.5 w-3.5" />
            EU CSRD &amp; EPR Compliant
          </span>

          <h1 className="mt-7 text-balance font-serif text-4xl font-bold leading-[1.08] tracking-tight text-foreground md:text-[3.25rem] lg:text-[3.75rem]">
            Brand lokal juara,{' '}
            <span className="relative inline-block">
              <span className="text-shimmer">rantai pasok</span>
            </span>{' '}
            terverifikasi — siap ekspor Eropa.
          </h1>

          <p className="mt-6 max-w-md text-pretty text-base leading-[1.75] text-muted-foreground md:text-[1.075rem]">
            Pintal menerbitkan{' '}
            <span className="font-semibold text-foreground">
              Digital Material Passport
            </span>{' '}
            berbasis QR — terverifikasi auditor LSM lokal, CSRD-compliant, dalam{' '}
            <span className="font-semibold text-foreground">72 jam</span>,{' '}
            <span className="font-semibold text-foreground">94% lebih murah</span> dari
            sertifikasi manual.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Primary CTA — besar, bernapas, premium */}
            <Link
              href="/register"
              className="group inline-flex w-full justify-center sm:w-auto items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-gold/25 transition-all hover:bg-primary/90 hover:gap-4 hover:shadow-xl hover:shadow-gold/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              Mulai Gratis 14 Hari
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-all group-hover:bg-white/30">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            {/* Secondary CTA */}
            <a
              href="#cara-kerja"
              className="group inline-flex w-full justify-center sm:w-auto items-center gap-2 rounded-full border border-border/80 bg-transparent px-7 py-4 text-base font-medium text-foreground transition-all hover:bg-surface hover:border-border"
            >
              <PlayCircle className="h-4.5 w-4.5 text-muted-foreground transition-colors group-hover:text-foreground" />
              Lihat Cara Kerja
            </a>
          </div>

          {/* Trust line */}
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-teal" />
            Dipercaya brand beromzet Rp 500 jt – Rp 10 M menuju pasar EU/AS
          </p>
        </div>

        {/* ── Dashboard card ───────────────────────── */}
        <div className="relative animate-[fade-up_0.8s_0.15s_ease_both]">
          {/* Glow */}
          <div
            aria-hidden="true"
            className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-gold/15 via-gold-lt/8 to-teal/8 blur-2xl"
          />

          <div className="rounded-2xl border border-border/80 bg-card shadow-2xl shadow-black/8">
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Material Passport
                </p>
                <p className="mt-0.5 font-serif text-xl font-bold text-foreground">
                  Tenun Ikat Sumba
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal ring-1 ring-teal/20">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal" />
                Terverifikasi
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-px border-b border-border bg-border">
              {[
                { k: 'Audit LSM', v: '100%', color: 'text-teal' },
                { k: 'Material', v: '5 jenis', color: 'text-foreground' },
                { k: 'Terbit dalam', v: '72 jam', color: 'text-gold' },
              ].map((s) => (
                <div key={s.k} className="bg-card px-4 py-4 text-center">
                  <p className={`font-serif text-2xl font-bold ${s.color}`}>
                    {s.v}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{s.k}</p>
                </div>
              ))}
            </div>

            {/* QR section */}
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-inner">
                <QrCode className="h-9 w-9" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  QR Passport aktif
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  pintal.id/p/9F2A-SUMBA-0042
                </p>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-teal to-teal/70" />
                </div>
              </div>
            </div>

            {/* Supply chain trail */}
            <div className="border-t border-border px-6 py-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Rantai Pasok Terverifikasi
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['Petani', 'Penenun', 'Celup', 'QC', 'Export'].map(
                  (step, i, arr) => (
                    <div key={step} className="flex items-center gap-1.5">
                      <span className="rounded bg-teal/10 px-2 py-0.5 text-[10px] font-medium text-teal">
                        {step}
                      </span>
                      {i < arr.length - 1 && (
                        <span className="h-px w-3 bg-border" />
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -right-4 -top-4 flex items-center gap-2 rounded-xl border border-gold/30 bg-card px-3.5 py-2 shadow-lg shadow-black/8 animate-[float_6s_ease-in-out_infinite]">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-xs font-semibold text-foreground">
              CSRD Ready
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
