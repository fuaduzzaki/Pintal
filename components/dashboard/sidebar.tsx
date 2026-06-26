'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Package,
  Plus,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  X,
  QrCode,
} from 'lucide-react'
import { PintalLogo } from '@/components/pintal-logo'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Produk & Passport',
    href: '/dashboard/products',
    icon: Package,
  },
  {
    label: 'Tambah Passport',
    href: '/dashboard/new',
    icon: Plus,
    highlight: true,
  },
  {
    label: 'Laporan CSRD',
    href: '/dashboard/reports',
    icon: FileText,
  },
]

const BOTTOM_ITEMS = [
  { label: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
]

function NavItem({
  item,
  active,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[0] & { badgeCount?: number }
  active: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
        active
          ? item.highlight
            ? 'bg-gold text-primary-foreground shadow-md shadow-gold/25'
            : 'bg-gold/10 text-gold'
          : item.highlight
            ? 'border border-dashed border-gold/40 text-gold hover:border-gold/60 hover:bg-gold/8'
            : 'text-muted-foreground hover:bg-surface hover:text-foreground',
      )}
    >
      {/* Active indicator */}
      {active && !item.highlight && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-gold" />
      )}
      <item.icon
        className={cn(
          'h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110',
          active && !item.highlight ? 'text-gold' : '',
        )}
      />
      <span className="flex-1">{item.label}</span>
      {'badgeCount' in item && item.badgeCount && !active ? (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-500 px-1 text-[9px] font-bold text-white">
          {item.badgeCount}
        </span>
      ) : (
        active && !item.highlight && (
          <ChevronRight className="h-3 w-3 opacity-40" />
        )
      )}
    </Link>
  )
}

/* ── Sidebar Content ─────────────────────────────────────── */
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const initials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'SW'

  const isActive = (item: (typeof NAV_ITEMS)[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5">
        <Link href="/" onClick={onClose}>
          <PintalLogo />
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Brand workspace */}
      <div className="mx-3 mb-4 rounded-xl border border-border bg-surface px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Brand Workspace
        </p>
        <p className="mt-0.5 text-sm font-semibold text-foreground">
          Sanggar Wastra Nusantara
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal" />
          <span className="text-[11px] font-medium text-teal">Pro · Aktif</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
          Menu Utama
        </p>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            active={isActive(item)}
            onClick={onClose}
          />
        ))}

        {/* Passport quick stats */}
        <div className="mt-5 rounded-xl border border-border bg-surface p-3">
          <div className="mb-2 flex items-center gap-2">
            <QrCode className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Ringkasan
            </p>
          </div>
          {[
            { label: 'Total Produk', value: '48' },
            { label: 'QR Aktif', value: '41' },
            { label: 'Terverifikasi', value: '37', color: 'text-teal' },
          ].map((s) => (
            <div key={s.label} className="mt-1.5 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">{s.label}</span>
              <span className={cn('text-[11px] font-bold', s.color ?? 'text-foreground')}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-border px-3 pt-3 pb-4 space-y-1">
        {BOTTOM_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            active={pathname === item.href}
            onClick={onClose}
          />
        ))}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>

        {/* User avatar */}
        <div className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background ring-2 ring-border">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">{session?.user?.name ?? 'Arini Kusuma'}</p>
            <p className="truncate text-[10px] text-muted-foreground">{session?.user?.email ?? 'arini@sanggarwastra.id'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Desktop Sidebar ─────────────────────────────────────── */
export function DashboardSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      <SidebarContent />
    </aside>
  )
}

/* ── Mobile Sidebar Drawer ───────────────────────────────── */
export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  if (!open) return null
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card shadow-2xl lg:hidden">
        <SidebarContent onClose={onClose} />
      </div>
    </>
  )
}
