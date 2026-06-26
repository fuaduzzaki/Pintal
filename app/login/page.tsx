'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
  QrCode,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { PintalLogo } from '@/components/pintal-logo'
import type { UserRole } from '@/lib/types'
import { getRoleRedirect } from '@/lib/roles'
import { cn } from '@/lib/utils'

const ROLES: { key: UserRole; label: string }[] = [
  { key: 'brand', label: 'Brand' },
  { key: 'artisan', label: 'Pengrajin' },
  { key: 'lsm_auditor', label: 'Auditor LSM' },
]

/* ── Animating weave paths ─────────────────────────────────── */
function BatikWeaveSVG() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="weave"
          x="0"
          y="0"
          width="64"
          height="64"
          patternUnits="userSpaceOnUse"
        >
          {/* Horizontal strands */}
          <line x1="0" y1="16" x2="64" y2="16" stroke="#e8c98a" strokeWidth="1" strokeDasharray="8 8" />
          <line x1="0" y1="32" x2="64" y2="32" stroke="#bf8a44" strokeWidth="0.5" />
          <line x1="0" y1="48" x2="64" y2="48" stroke="#e8c98a" strokeWidth="1" strokeDasharray="8 8" />
          {/* Vertical strands */}
          <line x1="16" y1="0" x2="16" y2="64" stroke="#bf8a44" strokeWidth="0.5" />
          <line x1="32" y1="0" x2="32" y2="64" stroke="#e8c98a" strokeWidth="1" strokeDasharray="8 8" />
          <line x1="48" y1="0" x2="48" y2="64" stroke="#bf8a44" strokeWidth="0.5" />
          {/* Diamond motif */}
          <polygon
            points="32,8 40,16 32,24 24,16"
            fill="none"
            stroke="#e8c98a"
            strokeWidth="0.75"
          />
          <polygon
            points="32,40 40,48 32,56 24,48"
            fill="none"
            stroke="#e8c98a"
            strokeWidth="0.75"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#weave)" />
    </svg>
  )
}

/* ── Passport card mockup ─────────────────────────────────── */
function PassportCard() {
  const [active, setActive] = useState(0)
  const passports = [
    {
      name: 'Tenun Ikat Sumba',
      material: 'Benang Sutera Alam',
      craftsman: 'Ibu Maria Mbiri',
      origin: 'Waingapu, NTT',
      carbon: '0.8 kg CO₂e',
      badge: '#9F2A-SUMBA',
    },
    {
      name: 'Batik Tulis Madura',
      material: '100% Katun Organik',
      craftsman: 'Bpk. Hasan Basri',
      origin: 'Bangkalan, Madura',
      carbon: '1.1 kg CO₂e',
      badge: '#7E3B-MADURA',
    },
  ]
  const p = passports[active]

  useEffect(() => {
    const t = setInterval(() => setActive((prev) => (prev + 1) % passports.length), 4000)
    return () => clearInterval(t)
  }, [passports.length])

  return (
    <div className="w-full max-w-xs rounded-2xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm shadow-2xl transition-all duration-700">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Material Passport
          </p>
          <p className="mt-0.5 font-serif text-base font-bold text-white">{p.name}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1d9e75]/20 px-2.5 py-1 text-[10px] font-semibold text-[#1d9e75] ring-1 ring-[#1d9e75]/30">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1d9e75]" />
          Terverifikasi
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        {[
          { k: 'Material', v: p.material },
          { k: 'Pengrajin', v: p.craftsman },
          { k: 'Asal', v: p.origin },
          { k: 'Jejak Karbon', v: p.carbon },
        ].map((row) => (
          <div
            key={row.k}
            className="flex items-center justify-between rounded-lg bg-white/4 px-3 py-2"
          >
            <span className="text-[11px] text-white/50">{row.k}</span>
            <span className="text-[11px] font-medium text-white/90">{row.v}</span>
          </div>
        ))}
      </div>

      {/* QR footer */}
      <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#bf8a44]/20 text-[#e8c98a]">
          <QrCode className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-white/90">QR Passport aktif</p>
          <p className="truncate text-[10px] text-white/40">pintal.id/p/{p.badge}</p>
        </div>
        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1d9e75]" />
      </div>

      {/* Dot indicator */}
      <div className="mt-4 flex justify-center gap-1.5">
        {passports.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'w-5 bg-[#bf8a44]' : 'w-1.5 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Tampilkan passport ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Main Login Page ─────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<UserRole>('brand')
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [focused, setFocused] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      role,
      redirect: false,
    })

    setIsLoading(false)

    if (result?.error) {
      setError('Email, password, atau role tidak valid.')
      toast.error('Login gagal. Periksa kredensial demo.')
      return
    }

    toast.success('Login berhasil!')
    router.push(getRoleRedirect(role))
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* ════════════════════════════════════════════════
          LEFT PANEL — Brand Identity
      ════════════════════════════════════════════════ */}
      <div className="relative hidden w-[48%] flex-col overflow-hidden bg-[#1e1510] lg:flex">
        {/* Batik weave background */}
        <BatikWeaveSVG />

        {/* Ambient blobs */}
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#bf8a44]/18 blur-[100px]" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-[#1d9e75]/12 blur-[80px]" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bf8a44]/8 blur-3xl" />

        {/* Top — Logo */}
        <div className="relative z-20 flex-shrink-0 p-10">
          <Link href="/" className="inline-flex">
            <PintalLogo
              markClassName="[&_path]:stroke-[#fafaf8] [&_rect:first-of-type]:fill-[#fafaf8]"
              textClassName="text-[#fafaf8]"
              showTagline
            />
          </Link>
        </div>

        {/* Center — Passport Card + headline */}
        <div className="relative z-20 flex flex-1 flex-col items-center justify-center px-10">
          <div className="animate-[fade-up_0.8s_ease_both]">
            {/* Floating CSRD badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#bf8a44]/30 bg-[#bf8a44]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#e8c98a]">
              <Sparkles className="h-3.5 w-3.5" />
              EU CSRD · EPR Compliant
            </div>

            {/* Headline */}
            <h2 className="mb-8 max-w-xs font-serif text-2xl font-bold leading-snug text-white">
              Rantai pasok lokal{' '}
              <span
                style={{
                  background:
                    'linear-gradient(90deg, #bf8a44 0%, #e8c98a 45%, #bf8a44 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 3s linear infinite',
                }}
              >
                terverifikasi
              </span>
              , siap pasar global.
            </h2>

            {/* Passport card */}
            <PassportCard />
          </div>
        </div>

        {/* Bottom — Stats + Quote */}
        <div className="relative z-20 flex-shrink-0 space-y-8 p-10">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/8 pt-8">
            {[
              { v: '3.200+', l: 'Produk Terpassport' },
              { v: '72 jam', l: 'Waktu Verifikasi' },
              { v: '94%', l: 'Lebih Hemat' },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-serif text-xl font-bold text-[#e8c98a]">{s.v}</p>
                <p className="mt-0.5 text-[11px] leading-tight text-white/40">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="space-y-3 border-l-2 border-[#bf8a44]/40 pl-4">
            <p className="font-serif text-sm italic leading-relaxed text-white/60">
              "Pintal membuat kami siap ekspor ke Eropa tanpa repot. Passport terbit sebelum deadline."
            </p>
            <footer className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#bf8a44]/60 to-[#bf8a44]/20 ring-1 ring-[#bf8a44]/30" />
              <div>
                <p className="text-xs font-semibold text-white/80">Arini Kusuma</p>
                <p className="text-[10px] text-white/40">Founder, Tenun Nusantara Co.</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          RIGHT PANEL — Login Form
      ════════════════════════════════════════════════ */}
      <div className="relative flex flex-1 flex-col bg-[#fafaf8]">
        {/* Subtle grain on right side */}
        <div className="grain pointer-events-none absolute inset-0 z-0" />

        {/* Soft top glow */}
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#bf8a44]/6 blur-3xl" />

        {/* Mobile logo */}
        <div className="relative z-10 flex-shrink-0 p-6 lg:hidden">
          <Link href="/">
            <PintalLogo />
          </Link>
        </div>

        {/* Centered form */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-14">
          <div className="w-full max-w-[400px] animate-[fade-up_0.5s_ease_both]">

            {/* Heading */}
            <div className="mb-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#ddd9d0] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#7a6a5c] shadow-sm">
                <ShieldCheck className="h-3 w-3 text-[#1d9e75]" />
                Aman & Terenkripsi
              </div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-[#3b2a1e]">
                Selamat datang kembali
              </h1>
              <p className="mt-2 text-sm text-[#7a6a5c]">
                Masuk ke dashboard Pintal Anda dan kelola passport produk.
              </p>
            </div>

            {/* Role tabs */}
            <div className="mb-5 flex rounded-2xl border border-[#ddd9d0] bg-white p-1 shadow-sm">
              {ROLES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key)}
                  className={cn(
                    'flex-1 rounded-xl py-2 text-xs font-semibold transition-all',
                    role === r.key
                      ? 'bg-[#bf8a44] text-white shadow-sm'
                      : 'text-[#7a6a5c] hover:text-[#3b2a1e]',
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Demo credentials hint */}
            <div className="mb-4 rounded-xl border border-[#ddd9d0] bg-[#f3f1ed] px-4 py-3 text-xs text-[#7a6a5c]">
              <p className="font-semibold text-[#3b2a1e]">Demo credentials:</p>
              <p className="mt-1">
                {role === 'brand' && 'brand@pintal.id / demo123'}
                {role === 'artisan' && 'artisan@pintal.id / demo123'}
                {role === 'lsm_auditor' && 'auditor@pintal.id / demo123'}
              </p>
            </div>

            {/* Google SSO */}
            <button
              type="button"
              id="login-google"
              onClick={() => router.push(getRoleRedirect(role))}
              className="group mb-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#ddd9d0] bg-white px-4 py-3.5 text-sm font-medium text-[#3b2a1e] shadow-sm transition-all duration-200 hover:border-[#bf8a44]/50 hover:bg-[#fafaf8] hover:shadow-md active:scale-[0.98]"
            >
              <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="transition-colors group-hover:text-[#3b2a1e]">Lanjutkan dengan Google</span>
            </button>

            {/* Divider */}
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#ddd9d0]" />
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="bg-[#fafaf8] px-3 text-[#7a6a5c]">atau masuk dengan email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="block text-sm font-medium text-[#3b2a1e]">
                  Alamat Email
                </label>
                <div className="relative">
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="nama@brand.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className="w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-[#3b2a1e] placeholder:text-[#7a6a5c]/50 shadow-sm outline-none transition-all duration-200"
                    style={{
                      borderColor:
                        focused === 'email' ? '#bf8a44' : '#ddd9d0',
                      boxShadow:
                        focused === 'email'
                          ? '0 0 0 3px rgba(191,138,68,0.12)'
                          : '0 1px 2px rgba(59,42,30,0.04)',
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="block text-sm font-medium text-[#3b2a1e]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-medium text-[#bf8a44] transition-colors hover:text-[#bf8a44]/75"
                  >
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    className="w-full rounded-2xl border bg-white px-4 py-3.5 pr-12 text-sm text-[#3b2a1e] placeholder:text-[#7a6a5c]/50 shadow-sm outline-none transition-all duration-200"
                    style={{
                      borderColor:
                        focused === 'password' ? '#bf8a44' : '#ddd9d0',
                      boxShadow:
                        focused === 'password'
                          ? '0 0 0 3px rgba(191,138,68,0.12)'
                          : '0 1px 2px rgba(59,42,30,0.04)',
                    }}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a6a5c] transition-colors hover:text-[#3b2a1e]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  role="checkbox"
                  id="remember-me"
                  aria-checked={form.remember}
                  onClick={() => setForm({ ...form, remember: !form.remember })}
                  className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-150"
                  style={{
                    borderColor: form.remember ? '#bf8a44' : '#ddd9d0',
                    backgroundColor: form.remember ? '#bf8a44' : 'white',
                  }}
                >
                  {form.remember && (
                    <svg
                      className="h-2.5 w-2.5 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <label htmlFor="remember-me" className="cursor-pointer select-none text-sm text-[#7a6a5c]">
                  Ingat saya selama 30 hari
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                id="login-submit"
                className="group relative mt-1 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-semibold text-[#fffaf2] shadow-lg transition-all duration-200 hover:gap-3.5 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  background: 'linear-gradient(135deg, #c9924b 0%, #bf8a44 50%, #a87538 100%)',
                  boxShadow: '0 4px 20px rgba(191,138,68,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
              >
                {/* Shimmer layer */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses…
                  </>
                ) : (
                  <>
                    Masuk
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="mt-6 text-center text-sm text-[#7a6a5c]">
              Belum punya akun?{' '}
              <Link
                href="/register"
                className="font-semibold text-[#bf8a44] transition-colors hover:text-[#bf8a44]/75 underline-offset-2 hover:underline"
              >
                Daftar gratis 14 hari →
              </Link>
            </p>

            {/* Trust badges */}
            <div className="mt-8 flex items-center justify-center gap-5 border-t border-[#ddd9d0] pt-6">
              {[
                { icon: '🔒', label: 'SSL Encrypted' },
                { icon: '🇪🇺', label: 'GDPR Compliant' },
                { icon: '🛡️', label: 'ISO 27001' },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-1.5 text-[11px] text-[#7a6a5c]">
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="relative z-10 flex-shrink-0 px-6 pb-6 text-center lg:px-14">
          <p className="text-[11px] text-[#7a6a5c]/60">
            Dengan masuk, kamu menyetujui{' '}
            <Link href="/terms" className="text-[#7a6a5c] underline underline-offset-2 hover:text-[#3b2a1e] transition-colors">
              Syarat Penggunaan
            </Link>{' '}
            &{' '}
            <Link href="/privacy" className="text-[#7a6a5c] underline underline-offset-2 hover:text-[#3b2a1e] transition-colors">
              Kebijakan Privasi
            </Link>{' '}
            Pintal.
          </p>
        </div>
      </div>
    </div>
  )
}
