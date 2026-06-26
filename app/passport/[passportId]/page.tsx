import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { PintalLogo } from '@/components/pintal-logo'
import { PassportCard } from '@/components/passport/passport-card'
import { getPassportById } from '@/lib/db'

export default async function PublicPassportPage({
  params,
}: {
  params: Promise<{ passportId: string }>
}) {
  const { passportId } = await params
  const passport = getPassportById(passportId)

  if (!passport || passport.status !== 'active') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card px-5 py-4">
          <PintalLogo />
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-5 text-center">
          <p className="font-serif text-xl font-bold text-foreground">
            Passport tidak ditemukan atau sudah tidak valid
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            QR code mungkin sudah expired atau tidak terdaftar di sistem Pintal.
          </p>
          <Link
            href="mailto:support@pintal.id"
            className="mt-6 inline-flex h-9 items-center justify-center rounded-full border border-border px-6 text-sm font-medium hover:bg-surface"
          >
            Laporkan QR yang mencurigakan
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-5 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <PintalLogo />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal ring-1 ring-teal/15">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified by Pintal VAN
          </span>
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-muted-foreground">
          Digital Material Passport
        </p>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8">
        <PassportCard passport={passport} />

        <footer className="mt-8 rounded-2xl border border-border bg-card p-5 text-center text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Laporan ini diterbitkan oleh Pintal Platform</p>
          <p className="mt-1">Untuk pertanyaan: support@pintal.id</p>
          <div className="mt-4 flex justify-center">
            <PintalLogo />
          </div>
        </footer>
      </main>
    </div>
  )
}
