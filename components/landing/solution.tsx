import { PencilLine, BadgeCheck, FileCheck2 } from 'lucide-react'

const STEPS = [
  {
    n: '01',
    icon: PencilLine,
    title: 'Pengrajin Input',
    body: 'Pengrajin dan pemasok mencatat asal material, proses produksi, dan tenaga kerja lewat web & mobile. Narasi rantai pasok terajut rapi sejak sumber.',
    detail: ['Data material', 'Proses tenun/batik', 'Info pengrajin', 'Foto dokumentasi'],
  },
  {
    n: '02',
    icon: BadgeCheck,
    title: 'Audit LSM',
    body: 'Jaringan auditor LSM & koperasi bersertifikat memverifikasi data di lapangan. Trust layer manusia yang nyata — bukan klaim sepihak, bukan blockchain.',
    detail: ['Kunjungan lapangan', 'Verifikasi dokumen', 'Wawancara pengrajin', 'Sertifikasi auditor'],
  },
  {
    n: '03',
    icon: FileCheck2,
    title: 'Passport Terbit',
    body: 'QR Code Material Passport CSRD-compliant terbit dalam 72 jam. Siap dipindai buyer, ritel, dan regulator Eropa kapan saja, di mana saja.',
    detail: ['QR Code unik', 'Laporan CSRD PDF', 'Dashboard brand', 'EPR compliant'],
  },
]

export function Solution() {
  return (
    <section id="cara-kerja" className="scroll-mt-16 bg-background">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Cara Kerja
          </p>
          <h2 className="mt-4 text-balance font-serif text-3xl font-bold leading-tight tracking-tight text-foreground md:text-[2.5rem]">
            Dari pengrajin ke pasar global
            <br className="hidden sm:block" /> dalam tiga langkah.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Proses terstruktur yang menggabungkan teknologi digital dengan verifikasi
            manusia yang sesungguhnya.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          {/* Connector line (desktop) */}
          <div
            aria-hidden="true"
            className="absolute left-[16.67%] right-[16.67%] top-[2.5rem] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />

          {STEPS.map((s) => (
            <div
              key={s.n}
              className="card-lift group relative rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-gold/30"
            >
              {/* Step number — large ghost */}
              <span className="absolute right-6 top-4 font-serif text-5xl font-bold text-border/60 transition-colors group-hover:text-gold/20">
                {s.n}
              </span>

              {/* Icon */}
              <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-foreground text-background shadow-md shadow-foreground/20 transition-transform group-hover:scale-105">
                <s.icon className="h-6 w-6" />
              </div>

              <h3 className="mt-6 font-serif text-xl font-bold text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-[1.75] text-muted-foreground">
                {s.body}
              </p>

              {/* Detail tags */}
              <div className="mt-5 flex flex-wrap gap-2">
                {s.detail.map((d) => (
                  <span
                    key={d}
                    className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom callout */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
          <span className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Waktu rata-rata: 72 jam kerja
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
        </div>
      </div>
    </section>
  )
}
