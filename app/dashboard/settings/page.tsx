'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  User,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'profile' | 'notifications' | 'security'

const TABS: { key: Tab; label: string; icon: typeof User }[] = [
  { key: 'profile', label: 'Profil Brand', icon: User },
  { key: 'notifications', label: 'Notifikasi', icon: Bell },
  { key: 'security', label: 'Keamanan', icon: Shield },
]

/* ── Notification preferences stored in localStorage ─── */
const NOTIF_STORAGE_KEY = 'pintal-notif-prefs'

interface NotifPrefs {
  auditComplete: boolean
  passportIssued: boolean
  weeklyReport: boolean
  productReminder: boolean
  emailEnabled: boolean
  browserEnabled: boolean
}

const DEFAULT_NOTIF: NotifPrefs = {
  auditComplete: true,
  passportIssued: true,
  weeklyReport: true,
  productReminder: false,
  emailEnabled: true,
  browserEnabled: false,
}

function loadNotifPrefs(): NotifPrefs {
  if (typeof window === 'undefined') return DEFAULT_NOTIF
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY)
    return raw ? { ...DEFAULT_NOTIF, ...JSON.parse(raw) } : DEFAULT_NOTIF
  } catch {
    return DEFAULT_NOTIF
  }
}

function saveNotifPrefs(prefs: NotifPrefs) {
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(prefs))
}

/* ── Toggle Switch ────────────────────────────────────── */
function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  id: string
}) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200',
        checked ? 'bg-teal' : 'bg-border',
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  )
}

/* ── Main Settings Page ───────────────────────────────── */
export default function SettingsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [saved, setSaved] = useState(false)

  // Profile state
  const [brandName, setBrandName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')

  // Notification state
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>(DEFAULT_NOTIF)

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Load session data into profile fields
  useEffect(() => {
    if (session?.user) {
      setBrandName(session.user.organizationName ?? '')
      setContactName(session.user.name ?? '')
      setEmail(session.user.email ?? '')
    }
  }, [session])

  // Load notification preferences
  useEffect(() => {
    setNotifPrefs(loadNotifPrefs())
  }, [])

  const showSavedToast = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleProfileSave = () => {
    // In a real app this would persist to the server
    showSavedToast()
  }

  const updateNotif = (key: keyof NotifPrefs, value: boolean) => {
    const next = { ...notifPrefs, [key]: value }
    setNotifPrefs(next)
    saveNotifPrefs(next)
  }

  const handleNotifSave = () => {
    saveNotifPrefs(notifPrefs)
    showSavedToast()
  }

  const handlePasswordSave = () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return
    // In a real app this would call an API
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    showSavedToast()
  }

  return (
    <div className="px-5 py-8 md:px-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Pengaturan
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola profil brand, preferensi notifikasi, dan keamanan akun Anda
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-4">
        {/* Sidebar tabs */}
        <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'group flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition-all',
                activeTab === tab.key
                  ? 'bg-gold/10 text-gold'
                  : 'text-muted-foreground hover:bg-surface hover:text-foreground',
              )}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{tab.label}</span>
              {activeTab === tab.key && (
                <ChevronRight className="hidden h-3 w-3 opacity-40 lg:block" />
              )}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* ── Profile Tab ─────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-foreground">
                Profil Brand
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Informasi ini ditampilkan pada material passport Anda
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="brandName" className="text-xs font-semibold text-foreground">
                    Nama Brand / Organisasi
                  </label>
                  <input
                    id="brandName"
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
                  />
                </div>
                <div>
                  <label htmlFor="contactName" className="text-xs font-semibold text-foreground">
                    Nama Kontak
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs font-semibold text-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="text-xs font-semibold text-foreground">
                    Telepon
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 812 xxxx xxxx"
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-gold"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="text-xs font-semibold text-foreground">
                    Kota
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Jakarta"
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-gold"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleProfileSave}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                >
                  <Save className="h-3.5 w-3.5" />
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* ── Notifications Tab ───────────────────── */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Event notifications */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-serif text-lg font-bold text-foreground">
                  Notifikasi Aktivitas
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pilih notifikasi yang ingin Anda terima
                </p>

                <div className="mt-5 divide-y divide-border">
                  {([
                    {
                      key: 'auditComplete' as const,
                      title: 'Audit Selesai',
                      desc: 'Pemberitahuan ketika auditor LSM menyelesaikan verifikasi produk Anda',
                    },
                    {
                      key: 'passportIssued' as const,
                      title: 'Passport Diterbitkan',
                      desc: 'Notifikasi ketika material passport baru aktif dan QR code siap digunakan',
                    },
                    {
                      key: 'weeklyReport' as const,
                      title: 'Laporan Mingguan',
                      desc: 'Ringkasan status produk dan progres audit setiap hari Senin',
                    },
                    {
                      key: 'productReminder' as const,
                      title: 'Pengingat Produk',
                      desc: 'Pengingat produk yang belum dilengkapi datanya atau passport yang akan kedaluwarsa',
                    },
                  ]).map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                      <Toggle
                        id={`notif-${item.key}`}
                        checked={notifPrefs[item.key]}
                        onChange={(v) => updateNotif(item.key, v)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery channels */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-serif text-lg font-bold text-foreground">
                  Saluran Notifikasi
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Cara Anda menerima notifikasi
                </p>

                <div className="mt-5 divide-y divide-border">
                  <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Email</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Kirim notifikasi ke {email || 'alamat email Anda'}
                      </p>
                    </div>
                    <Toggle
                      id="notif-email"
                      checked={notifPrefs.emailEnabled}
                      onChange={(v) => updateNotif('emailEnabled', v)}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Browser Push</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Tampilkan notifikasi push di browser Anda
                      </p>
                    </div>
                    <Toggle
                      id="notif-browser"
                      checked={notifPrefs.browserEnabled}
                      onChange={(v) => updateNotif('browserEnabled', v)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNotifSave}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                >
                  <Save className="h-3.5 w-3.5" />
                  Simpan Preferensi
                </button>
              </div>
            </div>
          )}

          {/* ── Security Tab ────────────────────────── */}
          {activeTab === 'security' && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-foreground">
                Ubah Kata Sandi
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Pastikan akun Anda menggunakan kata sandi yang kuat
              </p>

              <div className="mt-6 grid gap-5 max-w-md">
                <div>
                  <label htmlFor="currentPassword" className="text-xs font-semibold text-foreground">
                    Kata Sandi Saat Ini
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="text-xs font-semibold text-foreground">
                    Kata Sandi Baru
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="mt-1 text-xs text-destructive">
                      Kata sandi tidak cocok
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handlePasswordSave}
                  disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Perbarui Kata Sandi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-teal/25 bg-teal/10 px-4 py-3 text-sm font-semibold text-teal shadow-lg animate-[fade-up_0.3s_ease_both]">
          <CheckCircle2 className="h-4 w-4" />
          Perubahan berhasil disimpan
        </div>
      )}
    </div>
  )
}
