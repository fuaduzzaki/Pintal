import { Wallet, Clock, FileWarning } from 'lucide-react'

const PROBLEMS = [
  {
    icon: Wallet,
    number: '01',
    title: 'Sertifikasi manual mencekik modal',
    body: 'Audit rantai pasok konvensional menelan Rp 80–200 juta per koleksi. Biaya yang mustahil ditanggung brand menengah yang baru membangun reputasi ekspor.',
    accent: 'border-t-red-400/60',
  },
  {
    icon: Clock,
    number: '02',
    title: 'Buyer global menunggu, deal hangus',
    body: 'Proses due diligence berbulan-bulan membuat brand kehilangan jendela order. Tanpa dokumen terverifikasi, tender internasional dan investor mundur.',
    accent: 'border-t-orange-400/60',
  },
  {
    icon: FileWarning,
    number: '03',
    title: 'Regulasi EU CSRD & EPR sudah wajib',
    body: 'Mulai diberlakukan untuk produk impor ke EU. Tanpa material passport yang sah dan terverifikasi, produk Anda tidak bisa masuk rak ritel Eropa.',
    accent: 'border-t-gold/60',
  },
]

export function Problem() {
  return (
    <section className="relative border-y border-border bg-surface/50">
      {/* Subtle diagonal texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, #3b2a1e 0px, #3b2a1e 1px, transparent 1px, transparent 12px)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        {/* Section header */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Tantangan Nyata
          </p>
          <h2 className="mt-4 text-balance font-serif text-3xl font-bold leading-tight tracking-tight text-foreground md:text-[2.5rem]">
            Brand fashion lokal punya produk juara,
            <br className="hidden sm:block" /> tapi tertahan di pintu ekspor.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Tiga hambatan yang menghentikan brand Indonesia masuk ke pasar EU —
            dan Pintal hadir untuk menyelesaikan ketiganya.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div
              key={p.title}
              className={`card-lift group rounded-2xl border-t-2 border-border bg-card p-8 shadow-sm ${p.accent}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                  <p.icon className="h-5 w-5" />
                </div>
                <span className="font-serif text-4xl font-bold text-border">
                  {p.number}
                </span>
              </div>
              <h3 className="mt-6 font-serif text-xl font-bold leading-snug text-foreground">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-[1.75] text-muted-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
