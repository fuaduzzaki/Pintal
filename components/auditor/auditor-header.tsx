'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { PintalLogo } from '@/components/pintal-logo'

export function AuditorHeader() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-4">
          <Link href="/auditor">
            <PintalLogo />
          </Link>
          <span className="hidden h-6 w-px bg-border sm:block" />
          <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal ring-1 ring-teal/15">
            Portal Auditor LSM
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-foreground">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground">{session?.user?.organizationName}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </div>
      </div>
    </header>
  )
}
