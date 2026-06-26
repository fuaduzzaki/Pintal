const STATS = [
  {
    value: '72 jam',
    label: 'Waktu terbit material passport',
    sub: 'dari nol ke QR aktif',
    color: 'text-teal',
  },
  {
    value: '94%',
    label: 'Lebih hemat dari sertifikasi manual',
    sub: 'Rp 2,5 jt vs Rp 80–200 jt',
    color: 'text-gold',
  },
  {
    value: '15:1',
    label: 'Rasio LTV terhadap CAC',
    sub: 'unit economics sehat',
    color: 'text-foreground',
  },
  {
    value: '90%',
    label: 'Contribution margin',
    sub: 'per brand aktif',
    color: 'text-foreground',
  },
]

export function Stats() {
  return (
    <section id="tentang" className="scroll-mt-16 bg-background">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-8 py-14 md:px-14">
          {/* Background accent */}
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-12 left-8 h-40 w-40 rounded-full bg-teal/8 blur-3xl"
          />

          <div className="relative text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Angka Pintal
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-foreground md:text-3xl">
              Data berbicara sendiri.
            </h2>
          </div>

          <div className="relative mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={s.label} className="text-center">
                <p
                  className={`font-serif text-4xl font-bold tracking-tight md:text-5xl ${s.color}`}
                >
                  {s.value}
                </p>
                <p className="mx-auto mt-2 max-w-[14ch] text-sm font-medium leading-snug text-foreground">
                  {s.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
                {/* Separator (except last) */}
                {i < STATS.length - 1 && (
                  <div className="mx-auto mt-6 h-px w-8 bg-border sm:hidden" />
                )}
              </div>
            ))}
          </div>

          {/* BEP callout */}
          <div className="relative mt-10 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/8 px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" />
              <span className="text-xs font-semibold text-teal">
                Break-even point: 14 brand aktif
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
