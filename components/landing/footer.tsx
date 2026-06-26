import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PintalLogo } from '@/components/pintal-logo'

const COLUMNS = [
  {
    title: 'Produk',
    links: [
      { label: 'Cara Kerja', href: '#cara-kerja' },
      { label: 'Harga', href: '#harga' },
      { label: 'Material Passport', href: '#' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Perusahaan',
    links: [
      { label: 'Tentang Kami', href: '#tentang' },
      { label: 'Jaringan Auditor', href: '#' },
      { label: 'Karier', href: '#' },
      { label: 'Kontak', href: '#' },
    ],
  },
  {
    title: 'Sumber Daya',
    links: [
      { label: 'Regulasi CSRD', href: '#' },
      { label: 'Panduan EPR', href: '#' },
      { label: 'Studi Kasus', href: '#' },
      { label: 'Bantuan', href: '#' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      {/* Pre-footer CTA */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-12 text-center md:flex-row md:justify-between md:text-left md:px-8">
          <div>
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Siap membawa brand Anda ke pasar Eropa?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              14 hari gratis. Tanpa kartu kredit. Setup dalam 24 jam.
            </p>
          </div>
          {/* Link styled as button — no asChild needed */}
          <Link
            href="/login"
            className="group inline-flex w-full justify-center sm:w-auto shrink-0 items-center gap-3 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-md shadow-gold/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-gold/25 hover:-translate-y-0.5"
          >
            Mulai Sekarang
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <PintalLogo showTagline />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Digital Material Passport untuk brand fashion lokal Indonesia menembus
              pasar EU/AS — terpercaya, membumi, profesional.
            </p>
            {/* Compliance badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {['EU CSRD', 'EPR Compliant', 'LSM Verified'].map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-foreground">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Data <span className="text-gold">·</span> Trust{' '}
            <span className="text-gold">·</span> Flow
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Pintal. Human origin, system clarity.
          </p>
        </div>
      </div>
    </footer>
  )
}
