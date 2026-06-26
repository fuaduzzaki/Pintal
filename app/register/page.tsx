'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react'
import { PintalLogo } from '@/components/pintal-logo'

function BatikWeaveSVG() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden="true">
      <defs>
        <pattern id="weave-reg" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
          <line x1="0" y1="16" x2="64" y2="16" stroke="#e8c98a" strokeWidth="1" strokeDasharray="8 8" />
          <line x1="0" y1="32" x2="64" y2="32" stroke="#bf8a44" strokeWidth="0.5" />
          <line x1="0" y1="48" x2="64" y2="48" stroke="#e8c98a" strokeWidth="1" strokeDasharray="8 8" />
          <line x1="16" y1="0" x2="16" y2="64" stroke="#bf8a44" strokeWidth="0.5" />
          <line x1="32" y1="0" x2="32" y2="64" stroke="#e8c98a" strokeWidth="1" strokeDasharray="8 8" />
          <line x1="48" y1="0" x2="48" y2="64" stroke="#bf8a44" strokeWidth="0.5" />
          <polygon points="32,8 40,16 32,24 24,16" fill="none" stroke="#e8c98a" strokeWidth="0.75" />
          <polygon points="32,40 40,48 32,56 24,48" fill="none" stroke="#e8c98a" strokeWidth="0.75" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#weave-reg)" />
    </svg>
  )
}

const BENEFITS = [
  'Tidak perlu kartu kredit',
  'Material Passport terbit dalam 72 jam',
  'Dukungan onboarding gratis',
  'Batalkan kapan saja',
]

const TIPE_BISNIS = ['Brand Fashion', 'Distributor', 'Auditor LSM']

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [showPw, setShowPw] = useState(false)
  const [showPwConfirm, setShowPwConfirm] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [tipeBisnis, setTipeBisnis] = useState('')
  const [form, setForm] = useState({
    nama: '', email: '', password: '', confirmPassword: '',
    brand: '', website: '', kota: '',
  })

  const inputStyle = (field: string) => ({
    borderColor: focused === field ? '#bf8a44' : '#ddd9d0',
    boxShadow: focused === field
      ? '0 0 0 3px rgba(191,138,68,0.12)'
      : '0 1px 2px rgba(59,42,30,0.04)',
  })

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* LEFT PANEL */}
      <div className="relative hidden w-[48%] flex-col overflow-hidden bg-[#1e1510] lg:flex">
        <BatikWeaveSVG />
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#bf8a44]/18 blur-[100px]" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-[#1d9e75]/12 blur-[80px]" />

        {/* Logo */}
        <div className="relative z-20 flex-shrink-0 p-10">
          <Link href="/">
            <PintalLogo
              markClassName="[&_path]:stroke-[#fafaf8] [&_rect:first-of-type]:fill-[#fafaf8]"
              textClassName="text-[#fafaf8]"
              showTagline
            />
          </Link>
        </div>

        {/* Center */}
        <div className="relative z-20 flex flex-1 flex-col justify-center px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#bf8a44]/30 bg-[#bf8a44]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#e8c98a] mb-6 w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            14 Hari Gratis
          </div>
          <h2 className="font-serif text-2xl font-bold leading-snug text-white mb-6">
            Mulai perjalanan ekspor Anda{' '}
            <span style={{
              background: 'linear-gradient(90deg, #bf8a44 0%, #e8c98a 50%, #bf8a44 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 3s linear infinite',
            }}>
              dalam 14 hari gratis.
            </span>
          </h2>

          {/* Benefits */}
          <ul className="space-y-3 mb-10">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1d9e75]/20 text-[#1d9e75]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-white/70">{b}</span>
              </li>
            ))}
          </ul>

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
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="relative flex flex-1 flex-col bg-[#fafaf8]">
        <div className="grain pointer-events-none absolute inset-0 z-0" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#bf8a44]/6 blur-3xl" />

        {/* Mobile logo */}
        <div className="relative z-10 flex-shrink-0 p-6 lg:hidden">
          <Link href="/"><PintalLogo /></Link>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-14">
          <div className="w-full max-w-[400px] animate-[fade-up_0.5s_ease_both]">

            {/* Heading */}
            <div className="mb-6">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-[#3b2a1e]">
                Buat akun Pintal
              </h1>
              <p className="mt-1.5 text-sm text-[#7a6a5c]">
                Mulai kelola material passport brand Anda
              </p>
            </div>

            {/* Step pills */}
            <div className="mb-6 flex gap-2">
              {[{ n: 1, l: 'Info Akun' }, { n: 2, l: 'Profil Brand' }].map((s) => (
                <div
                  key={s.n}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    step === s.n
                      ? 'bg-[#bf8a44]/10 text-[#bf8a44] ring-1 ring-[#bf8a44]/30'
                      : step > s.n
                        ? 'bg-[#1d9e75]/10 text-[#1d9e75]'
                        : 'bg-[#f3f1ed] text-[#7a6a5c]'
                  }`}
                >
                  {step > s.n ? <CheckCircle2 className="h-3 w-3" /> : <span>{s.n}</span>}
                  {s.l}
                </div>
              ))}
            </div>

            {/* Google SSO */}
            {step === 1 && (
              <>
                <button
                  type="button"
                  id="register-google"
                  onClick={() => router.push('/dashboard')}
                  className="group mb-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#ddd9d0] bg-white px-4 py-3.5 text-sm font-medium text-[#3b2a1e] shadow-sm transition-all hover:border-[#bf8a44]/50 hover:shadow-md active:scale-[0.98]"
                >
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Daftar dengan Google
                </button>
                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#ddd9d0]" />
                  </div>
                  <div className="relative flex justify-center text-[11px]">
                    <span className="bg-[#fafaf8] px-3 text-[#7a6a5c]">atau daftar dengan email</span>
                  </div>
                </div>
              </>
            )}

            {/* Step 1 form */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="reg-nama" className="block text-sm font-medium text-[#3b2a1e] mb-1.5">Nama Lengkap</label>
                  <input id="reg-nama" type="text" placeholder="Arini Kusuma" value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    onFocus={() => setFocused('nama')} onBlur={() => setFocused(null)}
                    className="w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#3b2a1e] placeholder:text-[#7a6a5c]/50 shadow-sm outline-none transition-all"
                    style={inputStyle('nama')} />
                </div>
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-[#3b2a1e] mb-1.5">Alamat Email</label>
                  <input id="reg-email" type="email" placeholder="arini@brand.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    className="w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#3b2a1e] placeholder:text-[#7a6a5c]/50 shadow-sm outline-none transition-all"
                    style={inputStyle('email')} />
                </div>
                <div>
                  <label htmlFor="reg-pw" className="block text-sm font-medium text-[#3b2a1e] mb-1.5">Password</label>
                  <div className="relative">
                    <input id="reg-pw" type={showPw ? 'text' : 'password'} placeholder="Min. 8 karakter" value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      onFocus={() => setFocused('pw')} onBlur={() => setFocused(null)}
                      className="w-full rounded-2xl border bg-white px-4 py-3 pr-12 text-sm text-[#3b2a1e] placeholder:text-[#7a6a5c]/50 shadow-sm outline-none transition-all"
                      style={inputStyle('pw')} />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a6a5c] hover:text-[#3b2a1e]">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="reg-pw-confirm" className="block text-sm font-medium text-[#3b2a1e] mb-1.5">Konfirmasi Password</label>
                  <div className="relative">
                    <input id="reg-pw-confirm" type={showPwConfirm ? 'text' : 'password'} placeholder="Ulangi password" value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      onFocus={() => setFocused('pwc')} onBlur={() => setFocused(null)}
                      className="w-full rounded-2xl border bg-white px-4 py-3 pr-12 text-sm text-[#3b2a1e] placeholder:text-[#7a6a5c]/50 shadow-sm outline-none transition-all"
                      style={inputStyle('pwc')} />
                    <button type="button" onClick={() => setShowPwConfirm(!showPwConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a6a5c] hover:text-[#3b2a1e]">
                      {showPwConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button type="button" onClick={() => setStep(2)}
                  className="group mt-2 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-semibold text-[#fffaf2] shadow-lg transition-all hover:gap-3.5 hover:shadow-xl active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #c9924b 0%, #bf8a44 50%, #a87538 100%)', boxShadow: '0 4px 20px rgba(191,138,68,0.35)' }}>
                  Lanjut ke Profil Brand
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Step 2 form */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="reg-brand" className="block text-sm font-medium text-[#3b2a1e] mb-1.5">Nama Brand</label>
                  <input id="reg-brand" type="text" placeholder="cth. Sanggar Wastra Nusantara" value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    onFocus={() => setFocused('brand')} onBlur={() => setFocused(null)}
                    className="w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#3b2a1e] placeholder:text-[#7a6a5c]/50 shadow-sm outline-none transition-all"
                    style={inputStyle('brand')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3b2a1e] mb-2">Tipe Bisnis</label>
                  <div className="flex flex-wrap gap-2">
                    {TIPE_BISNIS.map((t) => (
                      <button key={t} type="button" onClick={() => setTipeBisnis(t)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                          tipeBisnis === t ? 'border-[#bf8a44] bg-[#bf8a44]/10 text-[#bf8a44]' : 'border-[#ddd9d0] bg-white text-[#7a6a5c] hover:border-[#bf8a44]/40'
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="reg-web" className="block text-sm font-medium text-[#3b2a1e] mb-1.5">Website / Instagram <span className="text-[#7a6a5c] font-normal">(opsional)</span></label>
                  <input id="reg-web" type="text" placeholder="@brandkamu atau www.brand.com" value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    onFocus={() => setFocused('web')} onBlur={() => setFocused(null)}
                    className="w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#3b2a1e] placeholder:text-[#7a6a5c]/50 shadow-sm outline-none transition-all"
                    style={inputStyle('web')} />
                </div>
                <div>
                  <label htmlFor="reg-kota" className="block text-sm font-medium text-[#3b2a1e] mb-1.5">Kota / Provinsi</label>
                  <input id="reg-kota" type="text" placeholder="cth. Jakarta, Bali, Yogyakarta" value={form.kota}
                    onChange={(e) => setForm({ ...form, kota: e.target.value })}
                    onFocus={() => setFocused('kota')} onBlur={() => setFocused(null)}
                    className="w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#3b2a1e] placeholder:text-[#7a6a5c]/50 shadow-sm outline-none transition-all"
                    style={inputStyle('kota')} />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 rounded-2xl border border-[#ddd9d0] bg-white px-5 py-3 text-sm font-medium text-[#3b2a1e] hover:bg-[#f3f1ed] transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                  </button>
                  <button type="button" id="register-submit"
                    onClick={() => router.push('/dashboard')}
                    className="group flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-3 text-sm font-semibold text-[#fffaf2] shadow-lg transition-all hover:gap-3"
                    style={{ background: 'linear-gradient(135deg, #c9924b 0%, #bf8a44 50%, #a87538 100%)', boxShadow: '0 4px 20px rgba(191,138,68,0.35)' }}>
                    Buat Akun Gratis
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Login link */}
            <p className="mt-6 text-center text-sm text-[#7a6a5c]">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-semibold text-[#bf8a44] hover:text-[#bf8a44]/75 transition-colors underline-offset-2 hover:underline">
                Masuk di sini →
              </Link>
            </p>

            {/* Trust badges */}
            <div className="mt-8 flex items-center justify-center gap-5 border-t border-[#ddd9d0] pt-6">
              {[{ icon: '🔒', label: 'SSL Encrypted' }, { icon: '🇪🇺', label: 'GDPR Compliant' }, { icon: '🛡️', label: 'ISO 27001' }].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 text-[11px] text-[#7a6a5c]">
                  <span>{b.icon}</span><span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
