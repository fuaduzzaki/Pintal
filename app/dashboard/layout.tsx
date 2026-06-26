'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Bell, Menu, Settings, Search, LogOut, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react'
import { DashboardSidebar, MobileSidebar } from '@/components/dashboard/sidebar'
import { DashboardProvider } from '@/components/dashboard/dashboard-context'
import { usePolling } from '@/lib/use-polling'
import type { ProductSubmission, AuditRecord } from '@/lib/types'

/* ── Notification types ─────────────────────────────────── */
interface Notification {
  id: string
  title: string
  body: string
  time: string
  type: 'approved' | 'rejected' | 'in_review' | 'pending_audit'
  read: boolean
}

const NOTIF_READ_KEY = 'pintal-notif-read'

function getReadIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    return new Set(JSON.parse(localStorage.getItem(NOTIF_READ_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

function saveReadIds(ids: Set<string>) {
  localStorage.setItem(NOTIF_READ_KEY, JSON.stringify([...ids]))
}

function buildNotifications(
  submissions: ProductSubmission[],
  auditRecords: AuditRecord[],
): Notification[] {
  const readIds = getReadIds()
  const notifs: Notification[] = []

  // Notifications from audit records (auditor decisions)
  for (const record of auditRecords) {
    const sub = submissions.find((s) => s.id === record.submissionId)
    notifs.push({
      id: `audit-${record.id}`,
      title:
        record.decision === 'approved'
          ? `Produk Disetujui`
          : `Produk Ditolak`,
      body:
        record.decision === 'approved'
          ? `"${sub?.productName ?? 'Produk'}" telah lolos audit oleh ${record.auditorName} (${record.auditorOrganization})`
          : `"${sub?.productName ?? 'Produk'}" ditolak oleh ${record.auditorName}. Alasan: ${record.rejectionReason ?? record.notes}`,
      time: record.auditedAt,
      type: record.decision,
      read: readIds.has(`audit-${record.id}`),
    })
  }

  // Notifications from status changes
  for (const sub of submissions) {
    if (sub.status === 'in_review') {
      notifs.push({
        id: `review-${sub.id}`,
        title: 'Sedang Direview',
        body: `"${sub.productName}" sedang dalam proses review oleh auditor LSM`,
        time: sub.updatedAt,
        type: 'in_review',
        read: readIds.has(`review-${sub.id}`),
      })
    }
    if (sub.status === 'pending_audit') {
      notifs.push({
        id: `pending-${sub.id}`,
        title: 'Menunggu Audit',
        body: `"${sub.productName}" sudah dikirim dan menunggu jadwal audit`,
        time: sub.updatedAt,
        type: 'pending_audit',
        read: readIds.has(`pending-${sub.id}`),
      })
    }
  }

  return notifs.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  )
}

/* ── Notification Icon Map ──────────────────────────────── */
function NotifIcon({ type }: { type: Notification['type'] }) {
  if (type === 'approved')
    return <CheckCircle2 className="h-4 w-4 text-teal" />
  if (type === 'rejected')
    return <AlertCircle className="h-4 w-4 text-destructive" />
  return <Clock className="h-4 w-4 text-gold" />
}

/* ── Main Layout ────────────────────────────────────────── */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const notifRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const initials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'SW'

  const unreadCount = notifications.filter((n) => !n.read).length

  const loadNotifications = useCallback(async () => {
    try {
      const [subRes, auditRes] = await Promise.all([
        fetch('/api/submissions'),
        fetch('/api/audit-records'),
      ])
      const submissions: ProductSubmission[] = await subRes.json()
      // audit-records endpoint may not exist yet, fall back gracefully
      let auditRecords: AuditRecord[] = []
      if (auditRes.ok) {
        auditRecords = await auditRes.json()
      }
      setNotifications(buildNotifications(submissions, auditRecords))
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => { loadNotifications() }, [loadNotifications])
  usePolling(loadNotifications)

  // Close dropdowns on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false)
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markAllRead = () => {
    const readIds = getReadIds()
    notifications.forEach((n) => readIds.add(n.id))
    saveReadIds(readIds)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markOneRead = (id: string) => {
    const readIds = getReadIds()
    readIds.add(id)
    saveReadIds(readIds)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Baru saja'
    if (mins < 60) return `${mins} menit lalu`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} jam lalu`
    const days = Math.floor(hours / 24)
    return `${days} hari lalu`
  }

  return (
    <DashboardProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <DashboardSidebar />
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-xl md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Buka menu navigasi"
                onClick={() => setMobileOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface hover:text-foreground lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>

              <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 sm:flex">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Cari produk, passport..."
                  className="w-48 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
                />
                <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-foreground">{session?.user?.organizationName}</p>
                <p className="text-[10px] text-muted-foreground">{session?.user?.name}</p>
              </div>

              {/* Settings — navigates to /dashboard/settings */}
              <Link
                href="/dashboard/settings"
                aria-label="Pengaturan"
                className="hidden h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface hover:text-foreground sm:flex"
              >
                <Settings className="h-4 w-4" />
              </Link>

              {/* Notifications — functional dropdown */}
              <div ref={notifRef} className="relative">
                <button
                  type="button"
                  aria-label="Notifikasi"
                  onClick={() => setShowNotif(!showNotif)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-primary-foreground">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10 sm:w-96">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-foreground">Notifikasi</p>
                        {unreadCount > 0 && (
                          <p className="text-[11px] text-muted-foreground">
                            {unreadCount} belum dibaca
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllRead}
                            className="rounded-lg px-2 py-1 text-[11px] font-medium text-gold transition-colors hover:bg-gold/10"
                          >
                            Tandai semua dibaca
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowNotif(false)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface hover:text-foreground"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-10 text-center">
                          <Bell className="mx-auto h-8 w-8 text-muted-foreground/30" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Belum ada notifikasi
                          </p>
                        </div>
                      ) : (
                        notifications.slice(0, 15).map((notif) => (
                          <button
                            key={notif.id}
                            type="button"
                            onClick={() => markOneRead(notif.id)}
                            className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface/50 ${
                              !notif.read ? 'bg-gold/[0.03]' : ''
                            }`}
                          >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface">
                              <NotifIcon type={notif.type} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-xs font-semibold text-foreground">
                                  {notif.title}
                                </p>
                                {!notif.read && (
                                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                                )}
                              </div>
                              <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                                {notif.body}
                              </p>
                              <p className="mt-1 text-[10px] text-muted-foreground/70">
                                {formatTime(notif.time)}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="border-t border-border px-4 py-2.5">
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setShowNotif(false)}
                          className="block text-center text-[11px] font-semibold text-gold transition-colors hover:text-gold/80"
                        >
                          Kelola preferensi notifikasi →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Avatar menu */}
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  aria-label="Profil pengguna"
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background ring-2 ring-background transition-shadow hover:ring-gold/40"
                >
                  {initials}
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-xl border border-border bg-card p-1 shadow-lg">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setShowMenu(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-muted-foreground hover:bg-surface"
                    >
                      <Settings className="h-3 w-3" />
                      Pengaturan
                    </Link>
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-xs text-muted-foreground hover:bg-surface"
                    >
                      Profil
                    </button>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-destructive hover:bg-destructive/5"
                    >
                      <LogOut className="h-3 w-3" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  )
}

