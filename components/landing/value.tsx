import { Timer, TrendingDown, ReceiptText, ArrowRight, CheckCircle2 } from 'lucide-react'

const VALUES = [
  {
    icon: Timer,
    metric: '72 jam',
    label: 'Passport Terbit',
    title: 'Dokumentasi kilat, bukan berminggu-minggu',
    body: 'Dari input pengrajin sampai QR Code aktif — tiga hari kerja. Buyer tidak perlu menunggu, deal tidak hangus.',
    points: ['Proses otomatis + auditor manusia', 'Notifikasi real-time tiap tahap'],
  },
  {
    icon: TrendingDown,
    metric: '94%',
    label: 'Lebih Hemat',
    title: 'Rp 2,5 jt bukan Rp 80–200 jt',
    body: 'Biaya kepatuhan yang akhirnya terjangkau brand menengah. Satu harga flat, tanpa biaya tersembunyi per dokumen.',
    points: ['Tanpa konsultan mahal', 'Satu harga flat per brand/bulan'],
  },
  {
    icon: ReceiptText,
    metric: 'Rp 2,5 jt',
    label: 'Per Brand/Bulan',
    title: 'Semua sudah termasuk, tidak ada kejutan',
    body: 'Dashboard real-time, laporan CSRD & EPR otomatis, dukungan auditor LSM, dan QR Code tanpa batas produk.',
    points: ['Dashboard + laporan unlimited', 'Onboarding high-touch'],
  },
]

export function Value() {
  return (
    <section
      id="keunggulan"
      className="scroll-mt-16 relative overflow-hidden border-y border-border bg-foreground text-background"
    >
      {/* Subtle grain */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #fafaf8 0px, #fafaf8 1px, transparent 1px, transparent 14px)',
        }}
      />

      {/* Gold orb */}
      <div
        aria-hidden="true"
        className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-lt">
              Kenapa Pintal
            </p>
            <h2 className="mt-4 text-balance font-serif text-3xl font-bold leading-tight md:text-[2.5rem]">
              Keunggulan yang terukur,
              <br className="hidden sm:block" /> bukan sekadar janji.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-background/60 md:text-right">
            Angka-angka ini bukan estimasi — ini berdasarkan perbandingan nyata dengan
            biaya sertifikasi manual di industri fashion Indonesia.
          </p>
        </div>

        {/* Value cards */}
        <div className="mt-14 grid overflow-hidden rounded-2xl border border-background/15 bg-background/8 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className={`group relative flex flex-col gap-0 p-8 transition-colors hover:bg-background/8 ${
                i > 0 ? 'border-t border-background/15 md:border-l md:border-t-0' : ''
              }`}
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-primary-foreground shadow-lg shadow-gold/30">
                <v.icon className="h-5 w-5" />
              </div>

              {/* Metric */}
              <div className="mt-6">
                <p className="text-shimmer font-serif text-4xl font-bold tracking-tight">
                  {v.metric}
                </p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.15em] text-background/50">
                  {v.label}
                </p>
              </div>

              <h3 className="mt-4 text-lg font-semibold leading-snug">{v.title}</h3>
              <p className="mt-2.5 flex-1 text-sm leading-[1.75] text-background/65">{v.body}</p>

              <ul className="mt-5 flex flex-col gap-2">
                {v.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-xs text-background/60">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gold-lt" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom callout */}
        <div className="mt-10 flex items-center gap-3 text-sm text-background/60">
          <ArrowRight className="h-4 w-4 text-gold-lt" />
          Kredensial digital meningkatkan bargaining power — akses ke brand global
          tanpa eksploitasi tengkulak.
        </div>
      </div>
    </section>
  )
}
