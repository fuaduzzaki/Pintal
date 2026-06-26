import Link from 'next/link'
import { Bell, ChevronDown, Settings } from 'lucide-react'
import { PintalLogo } from '@/components/pintal-logo'

export function DashboardTopbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        {/* Left: logo + brand */}
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Pintal beranda" className="flex-shrink-0">
            <PintalLogo />
          </Link>
          <span className="hidden h-6 w-px bg-border sm:block" />
          <div className="hidden sm:flex">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-surface"
            >
              <div className="flex flex-col items-start leading-none">
                <span className="text-sm font-semibold text-foreground">
                  Sanggar Wastra Nusantara
                </span>
                <span className="mt-0.5 text-xs text-muted-foreground">
                  Brand Workspace
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Right: status + actions + avatar */}
        <div className="flex items-center gap-2.5">
          {/* Subscription badge */}
          <span className="hidden items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal ring-1 ring-teal/15 sm:inline-flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal" />
            Pro · Aktif
          </span>

          {/* Settings */}
          <button
            type="button"
            aria-label="Pengaturan"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface hover:text-foreground sm:flex"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifikasi"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold ring-1 ring-card" />
          </button>

          {/* Avatar */}
          <button
            type="button"
            aria-label="Profil pengguna"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background shadow-sm ring-2 ring-background transition-shadow hover:ring-gold/40"
          >
            SW
          </button>
        </div>
      </div>
    </header>
  )
}
