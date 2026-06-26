'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { LogOut, Plus } from 'lucide-react'
import { PintalLogo } from '@/components/pintal-logo'

export function ArtisanHeader() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 shadow-md" style={{ background: '#1e1510' }}>
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/artisan">
            <PintalLogo
              markClassName="[&_path]:stroke-white [&_rect:first-of-type]:fill-white"
              textClassName="text-white"
            />
          </Link>
          <span className="hidden h-4 w-px bg-white/20 sm:block" />
          <span className="rounded-full border border-gold/30 bg-gold/15 px-3 py-0.5 text-xs font-semibold text-gold">
            Portal Pengrajin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-white">{session?.user?.name}</p>
            <p className="text-xs text-white/60">{session?.user?.city}</p>
          </div>
          <Link
            href="/artisan/submit"
            className="hidden items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 sm:inline-flex"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Produk Baru
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </div>
      </div>
    </header>
  )
}
