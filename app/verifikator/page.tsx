'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  CheckCircle2, Clock, ClipboardList, XCircle, ArrowLeft, ShieldCheck, LogOut,
  ChevronRight, FileText, User, MapPin, Package, Camera, RotateCcw,
  Upload, Eye, TrendingUp, Bell, MessageSquare, BarChart3, History, Settings,
  Send, AlertTriangle, Star, Award, Target, Zap, Printer, X,
  Home, Search, ChevronDown, Menu,
} from 'lucide-react'
import { PintalLogo } from '@/components/pintal-logo'
import { cn } from '@/lib/utils'
import {
  getStoredAuditTasks, saveStoredAuditTasks,
  getStoredNotifications, saveStoredNotifications, markAllNotifsRead,
  getVerifikatorProfile, saveVerifikatorProfile,
  type AuditTask, type AuditTaskStatus, type Notification, type VerifikatorProfile, type ChatMessage,
} from '@/lib/storage'

/* ── Status & priority config ───────────────────────── */
const STATUS_CFG: Record<AuditTaskStatus, { label: string; color: string; dot: string; bg: string }> = {
  'Menunggu Review':         { label: 'Menunggu Review',  color: 'text-slate-500',   dot: 'bg-slate-400',   bg: 'bg-slate-100 ring-1 ring-slate-200' },
  'Sedang Diaudit':          { label: 'Sedang Diaudit',   color: 'text-amber-600',   dot: 'bg-amber-400',   bg: 'bg-amber-50 ring-1 ring-amber-200' },
  'Menunggu Data Pengrajin': { label: 'Tunggu Pengrajin', color: 'text-orange-600',  dot: 'bg-orange-400',  bg: 'bg-orange-50 ring-1 ring-orange-200' },
  'Data Pengrajin Masuk':    { label: 'Data Masuk',       color: 'text-blue-600',    dot: 'bg-blue-500',    bg: 'bg-blue-50 ring-1 ring-blue-200' },
  'Disetujui':               { label: 'Disetujui ✓',      color: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50 ring-1 ring-emerald-200' },
  'Revisi':                  { label: 'Minta Revisi',     color: 'text-orange-600',  dot: 'bg-orange-400',  bg: 'bg-orange-50 ring-1 ring-orange-200' },
  'Ditolak':                 { label: 'Ditolak',          color: 'text-red-500',     dot: 'bg-red-500',     bg: 'bg-red-50 ring-1 ring-red-200' },
}
const PRIORITY_CFG = {
  Tinggi: { color: 'text-red-600',     bg: 'bg-red-50 ring-1 ring-red-200',         dot: 'bg-red-500' },
  Sedang: { color: 'text-amber-600',   bg: 'bg-amber-50 ring-1 ring-amber-200',     dot: 'bg-amber-400' },
  Rendah: { color: 'text-emerald-600', bg: 'bg-emerald-50 ring-1 ring-emerald-200', dot: 'bg-emerald-500' },
}

function isOverdue(d?: string) {
  if (!d) return false
  try {
    const p = d.split(' ')
    const m: Record<string,number> = {Jan:0,Feb:1,Mar:2,Apr:3,Mei:4,Jun:5,Jul:6,Agu:7,Sep:8,Okt:9,Nov:10,Des:11,Juni:5,Juli:6}
    return new Date(+p[2], m[p[1]]??0, +p[0]) < new Date()
  } catch { return false }
}
function daysUntil(d?: string) {
  if (!d) return 99
  try {
    const p = d.split(' ')
    const m: Record<string,number> = {Jan:0,Feb:1,Mar:2,Apr:3,Mei:4,Jun:5,Jul:6,Agu:7,Sep:8,Okt:9,Nov:10,Des:11,Juni:5,Juli:6}
    return Math.ceil((new Date(+p[2], m[p[1]]??0, +p[0]).getTime() - Date.now()) / 86400000)
  } catch { return 99 }
}

/* ── Reusable small components ──────────────────────── */
function StatusBadge({ status }: { status: AuditTaskStatus }) {
  const c = STATUS_CFG[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap', c.bg, c.color)}>
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', c.dot, status === 'Sedang Diaudit' && 'animate-pulse')} />
      {c.label}
    </span>
  )
}
function PriorityBadge({ priority }: { priority?: 'Tinggi'|'Sedang'|'Rendah' }) {
  if (!priority) return null
  const c = PRIORITY_CFG[priority]
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', c.bg, c.color)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />{priority}
    </span>
  )
}
function DeadlineChip({ deadline, status }: { deadline?: string; status: AuditTaskStatus }) {
  if (!deadline || status === 'Disetujui' || status === 'Ditolak') return null
  const days = daysUntil(deadline)
  const over = days < 0, soon = days <= 2
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
      over ? 'bg-red-50 text-red-600 ring-1 ring-red-200' : soon ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200' : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200')}>
      <Clock className="h-2.5 w-2.5" />
      {over ? `${Math.abs(days)}h telat` : days === 0 ? 'Hari ini!' : `${days}h lagi`}
    </span>
  )
}
function GoldBar({ value, delay = 0 }: { value: number; delay?: number }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(value), 100 + delay); return () => clearTimeout(t) }, [value, delay])
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${w}%`, background: 'linear-gradient(90deg,#bf8a44,#e8c98a)' }} />
    </div>
  )
}

/* ── Notification panel ─────────────────────────────── */
const NOTIF_ICON: Record<Notification['type'], React.ReactNode> = {
  new_task:     <Package className="h-4 w-4 text-amber-500" />,
  artisan_data: <User className="h-4 w-4 text-blue-500" />,
  deadline:     <Clock className="h-4 w-4 text-orange-500" />,
  system:       <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
}
function NotifPanel({ notifs, onClose, onMarkAll, onTask }: {
  notifs: Notification[]; onClose: ()=>void; onMarkAll: ()=>void; onTask:(id:string)=>void
}) {
  const unread = notifs.filter(n=>!n.isRead).length
  return (
    <div className="absolute right-0 top-14 z-50 w-[340px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl animate-[fade-up_0.2s_ease_both]"
      style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)' }}>
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
        <div>
          <p className="font-bold text-gray-900">Notifikasi</p>
          {unread > 0 && <p className="text-xs text-amber-600">{unread} belum dibaca</p>}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && <button onClick={onMarkAll} className="text-xs font-medium text-amber-600 hover:text-amber-700">Baca semua</button>}
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
        {notifs.length === 0
          ? <div className="py-10 text-center text-sm text-gray-400">Tidak ada notifikasi</div>
          : notifs.map(n => (
            <div key={n.id} onClick={() => { if(n.taskId){onTask(n.taskId);onClose()} }}
              className={cn('flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-amber-50/50', !n.isRead && 'bg-amber-50/30')}>
              <div className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', !n.isRead ? 'bg-amber-100' : 'bg-gray-100')}>
                {NOTIF_ICON[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold', !n.isRead ? 'text-gray-900' : 'text-gray-500')}>{n.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-[10px] text-gray-300 mt-1">{n.timestamp}</p>
              </div>
              {!n.isRead && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-500" />}
            </div>
          ))}
      </div>
    </div>
  )
}

/* ── Chat panel ─────────────────────────────────────── */
function ChatPanel({ task, onSend }: { task: AuditTask; onSend:(m:string)=>void }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const msgs = task.messages ?? []
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs.length])
  const send = () => { if (!input.trim()) return; onSend(input.trim()); setInput('') }
  return (
    <div className="flex h-[400px] flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.length === 0
          ? <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <MessageSquare className="h-7 w-7 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-400">Belum ada pesan</p>
              <p className="text-xs text-gray-300">Mulai komunikasi dengan brand atau pengrajin</p>
            </div>
          : msgs.map(m => {
              const mine = m.sender === 'verifikator'
              return (
                <div key={m.id} className={cn('flex gap-2', mine ? 'justify-end' : 'justify-start')}>
                  {!mine && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600">
                      {m.senderName.charAt(0)}
                    </div>
                  )}
                  <div className="max-w-[72%]">
                    {!mine && <p className="mb-1 text-[10px] font-semibold text-gray-400">{m.senderName}</p>}
                    <div className={cn('rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm',
                      mine ? 'rounded-tr-sm text-white' : 'rounded-tl-sm bg-gray-100 text-gray-800')}
                      style={mine ? {background:'linear-gradient(135deg,#bf8a44,#d4a054)'} : {}}>
                      {m.message}
                    </div>
                    <p className={cn('mt-1 text-[10px] text-gray-400', mine ? 'text-right' : 'text-left')}>{m.timestamp}</p>
                  </div>
                </div>
              )
            })}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
            placeholder="Ketik pesan..." className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none" />
          <button onClick={send} disabled={!input.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white transition-all disabled:opacity-30"
            style={{background:'linear-gradient(135deg,#bf8a44,#d4a054)'}}>
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Detail panel ───────────────────────────────────── */
function DetailPanel({ task, onBack, onUpdate }: { task:AuditTask; onBack:()=>void; onUpdate:(u:AuditTask)=>void }) {
  const [checklist, setChecklist] = useState(task.checklistItems)
  const [note, setNote] = useState(task.verifikatorNote ?? '')
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'brand'|'pengrajin'|'checklist'|'chat'>('brand')
  const msgs = task.messages ?? []
  const checked = checklist.filter(c=>c.checked).length
  const allChecked = checked === checklist.length

  const act = async (action: 'approve'|'revisi'|'tolak') => {
    setSaving(true)
    await new Promise(r=>setTimeout(r,800))
    const s: AuditTaskStatus = action==='approve' ? 'Disetujui' : action==='revisi' ? 'Revisi' : 'Ditolak'
    onUpdate({ ...task, checklistItems:checklist, verifikatorNote:note, status:s,
      progress: action==='approve' ? 100 : action==='revisi' ? task.progress : 0,
      completedAt: new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}),
      auditDurationHours: Math.floor(Math.random()*20)+10 })
    setSaving(false)
  }
  const startAudit = async () => {
    setSaving(true); await new Promise(r=>setTimeout(r,600))
    onUpdate({ ...task, status:'Sedang Diaudit', progress:Math.max(task.progress,20) }); setSaving(false)
  }
  const sendMsg = useCallback((msg:string) => {
    const m: ChatMessage = { id:`m-${Date.now()}`, sender:'verifikator', senderName:'Ahmad Fauzi', message:msg,
      timestamp: new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}), isRead:true }
    onUpdate({ ...task, messages:[...(task.messages??[]), m] })
  }, [task, onUpdate])

  const TABS = [
    { key:'brand' as const,     label:'Brand',       icon:Package,      count:0 },
    { key:'pengrajin' as const, label:'Pengrajin',   icon:User,         count:0 },
    { key:'checklist' as const, label:`Checklist`,   icon:ClipboardList,count:checked },
    { key:'chat' as const,      label:'Pesan',       icon:MessageSquare,count:msgs.filter(m=>!m.isRead).length },
  ]

  return (
    <div className="animate-[fade-up_0.3s_ease_both] pb-24 lg:pb-0">
      {/* Back + export */}
      <div className="mb-5 flex items-center justify-between">
        <button onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 shadow-sm hover:border-amber-300 hover:text-amber-600 transition-all active:scale-95">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>
        <button onClick={()=>window.print()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-500 shadow-sm hover:border-amber-300 hover:text-amber-600 transition-all active:scale-95">
          <Printer className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      {/* Hero card */}
      <div className="mb-5 overflow-hidden rounded-2xl shadow-lg" style={{background:'linear-gradient(135deg,#1e1510 0%,#2e1e10 60%,#3b2a1e 100%)'}}>
        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-2">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                <DeadlineChip deadline={task.deadline} status={task.status} />
              </div>
              <h2 className="font-serif text-2xl font-bold text-white leading-tight">{task.productName}</h2>
              <p className="text-sm text-white/50 mt-1">{task.brandName} · <code className="font-mono text-xs text-amber-400/70">{task.productQr}</code></p>
            </div>
            {task.status === 'Menunggu Review' && (
              <button onClick={startAudit} disabled={saving}
                className="shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-60"
                style={{background:'linear-gradient(135deg,#bf8a44,#d4a054)'}}>
                <Eye className="h-4 w-4" />{saving ? 'Memulai...' : 'Mulai Audit'}
              </button>
            )}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[{l:'Deadline',v:task.deadline??'—'},{l:'Disubmit',v:task.submittedAt},{l:'Selesai',v:task.completedAt??'—'}].map(s=>(
              <div key={s.l} className="rounded-xl px-3 py-2.5" style={{background:'rgba(255,255,255,0.08)'}}>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">{s.l}</p>
                <p className="mt-0.5 text-xs font-semibold text-white/80">{s.v}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between">
              <span className="text-xs text-white/40">Progres</span>
              <span className="text-xs font-bold text-amber-400">{task.progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full" style={{background:'rgba(255,255,255,0.1)'}}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{width:`${task.progress}%`, background:'linear-gradient(90deg,#bf8a44,#e8c98a)'}} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-2xl border border-gray-100 bg-white p-1 shadow-sm overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={()=>setTab(t.key)}
            className={cn('relative flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all whitespace-nowrap',
              tab===t.key ? 'text-white shadow-sm' : 'text-gray-400 hover:text-gray-700')}
            style={tab===t.key ? {background:'linear-gradient(135deg,#1e1510,#3b2a1e)'} : {}}>
            <t.icon className="h-3.5 w-3.5" />{t.label}
            {t.count > 0 && (
              <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Brand */}
      {tab==='brand' && (
        <div className="space-y-4 animate-[fade-up_0.2s_ease_both]">
          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
              <Package className="h-4 w-4 text-amber-500" />Informasi Produk
            </h3>
            <div className="grid gap-3 grid-cols-2">
              {[{l:'Nama',v:task.productName},{l:'Kategori',v:task.category},{l:'Material',v:task.material},{l:'Komposisi',v:task.komposisi||'—'},{l:'Provinsi',v:task.provinsi||'—'},{l:'Prioritas',v:task.priority||'—'}].map(r=>(
                <div key={r.l} className="rounded-xl bg-gray-50 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{r.l}</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-800 truncate">{r.v}</p>
                </div>
              ))}
            </div>
            {task.proses.length > 0 && (
              <div className="mt-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Proses</p>
                <div className="flex flex-wrap gap-1.5">
                  {task.proses.map(p=><span key={p} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">{p}</span>)}
                </div>
              </div>
            )}
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white"
                style={{background:'linear-gradient(135deg,#bf8a44,#d4a054)'}}>
                {task.brandName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{task.brandName}</p>
                <p className="text-xs text-gray-500">{task.brandEmail}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Pengrajin */}
      {tab==='pengrajin' && (
        <div className="animate-[fade-up_0.2s_ease_both]">
          {task.artisanData ? (
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2"><User className="h-4 w-4 text-amber-500" />Data Pengrajin</h3>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-200">✓ Masuk</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[{l:'Bahan Baku',v:task.artisanData.bahan},{l:'Asal',v:task.artisanData.provinsi},{l:'Teknik',v:task.artisanData.teknik},{l:'Tgl Produksi',v:task.artisanData.tanggal},{l:'Jumlah',v:`${task.artisanData.jumlah} pcs`},{l:'Disubmit',v:task.artisanData.submittedAt}].map(r=>(
                  <div key={r.l} className="rounded-xl bg-gray-50 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{r.l}</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800 truncate">{r.v}</p>
                  </div>
                ))}
              </div>
              {task.artisanData.proses && <div className="mt-3 rounded-xl bg-gray-50 p-4"><p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Proses</p><p className="text-sm text-gray-700 leading-relaxed">{task.artisanData.proses}</p></div>}
              {task.artisanData.catatan && <div className="mt-3 rounded-xl bg-amber-50 p-4"><p className="text-[9px] font-bold uppercase tracking-wider text-amber-600 mb-1">Catatan</p><p className="text-sm text-amber-800">{task.artisanData.catatan}</p></div>}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 py-14 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
              <p className="font-bold text-orange-700">Data Pengrajin Belum Masuk</p>
              <p className="mt-1.5 max-w-xs text-sm text-orange-500">Pengrajin belum menginput data material untuk produk ini.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Checklist */}
      {tab==='checklist' && (
        <div className="space-y-4 animate-[fade-up_0.2s_ease_both]">
          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2"><ClipboardList className="h-4 w-4 text-amber-500" />Checklist</h3>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600">{checked}/{checklist.length}</span>
            </div>
            <div className="space-y-2">
              {checklist.map(item => (
                <label key={item.id}
                  className={cn('flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 transition-all active:scale-[0.98]',
                    item.checked ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 hover:border-amber-200 hover:bg-amber-50/30')}>
                  <div className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                    item.checked ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300')}>
                    {item.checked && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>
                  <input type="checkbox" checked={item.checked} onChange={()=>setChecklist(prev=>prev.map(c=>c.id===item.id?{...c,checked:!c.checked}:c))} className="sr-only" />
                  <span className={cn('text-sm flex-1', item.checked ? 'text-emerald-700 line-through' : 'text-gray-700 font-medium')}>{item.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-4">
              <GoldBar value={(checked/checklist.length)*100} />
              <p className="mt-1.5 text-xs text-gray-400">{checked} dari {checklist.length} item terverifikasi</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-2">Catatan Verifikator</label>
            <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3}
              placeholder="Tulis catatan hasil audit, temuan lapangan, atau rekomendasi..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 focus:bg-white" />
          </div>

          {/* Foto upload */}
          <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-200"><Camera className="h-5 w-5 text-gray-400" /></div>
            <div className="flex-1"><p className="text-sm font-semibold text-gray-700">Upload Foto Lapangan</p><p className="text-xs text-gray-400">Dokumentasi kunjungan</p></div>
            <button className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:border-amber-300 hover:text-amber-600 transition-all active:scale-95">
              <Upload className="inline h-3 w-3 mr-1" />Upload
            </button>
          </div>

          {task.status !== 'Disetujui' && task.status !== 'Ditolak' && (
            <div className="space-y-2.5">
              <button onClick={()=>act('approve')} disabled={saving||!allChecked}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                style={{background: allChecked ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#9ca3af,#6b7280)'}}>
                <CheckCircle2 className="h-5 w-5" />{saving ? 'Menyimpan...' : 'Setujui & Terbitkan Passport'}
              </button>
              <div className="grid grid-cols-2 gap-2.5">
                <button onClick={()=>act('revisi')} disabled={saving}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-orange-200 bg-orange-50 py-3 text-sm font-bold text-orange-700 hover:bg-orange-100 transition-all active:scale-95 disabled:opacity-50">
                  <RotateCcw className="h-4 w-4" />Revisi
                </button>
                <button onClick={()=>act('tolak')} disabled={saving}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 hover:bg-red-100 transition-all active:scale-95 disabled:opacity-50">
                  <XCircle className="h-4 w-4" />Tolak
                </button>
              </div>
              {!allChecked && <p className="text-center text-xs text-gray-400">Centang semua item untuk menyetujui</p>}
            </div>
          )}

          {(task.status==='Disetujui'||task.status==='Ditolak') && (
            <div className={cn('flex flex-col items-center rounded-2xl border-2 py-8 text-center', task.status==='Disetujui' ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50')}>
              {task.status==='Disetujui'
                ? <><div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100"><CheckCircle2 className="h-7 w-7 text-emerald-600" /></div><p className="font-bold text-emerald-700">Passport Disetujui</p><p className="text-xs text-emerald-500 mt-1">QR aktif sejak {task.completedAt}</p></>
                : <><div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100"><XCircle className="h-7 w-7 text-red-500" /></div><p className="font-bold text-red-700">Pengajuan Ditolak</p><p className="text-xs text-red-400 mt-1">Brand sudah diberitahu</p></>
              }
            </div>
          )}
        </div>
      )}

      {/* Tab: Chat */}
      {tab==='chat' && (
        <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm animate-[fade-up_0.2s_ease_both]">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="font-bold text-gray-800">Pesan — {task.brandName}</p>
            <p className="text-xs text-gray-400">{msgs.length} pesan</p>
          </div>
          <ChatPanel task={task} onSend={sendMsg} />
        </div>
      )}
    </div>
  )
}

/* ── Riwayat view ───────────────────────────────────── */
function RiwayatView({ tasks, onSelect }: { tasks:AuditTask[]; onSelect:(t:AuditTask)=>void }) {
  const done = tasks.filter(t=>['Disetujui','Ditolak','Revisi'].includes(t.status))
  const approved = done.filter(t=>t.status==='Disetujui').length
  const rejected = done.filter(t=>t.status==='Ditolak').length
  return (
    <div className="pb-24 lg:pb-0">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-gray-900">Riwayat Audit</h2>
        <p className="mt-1 text-sm text-gray-500">{done.length} audit selesai · {approved} disetujui · {rejected} ditolak</p>
      </div>
      {done.length === 0
        ? <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
            <History className="mx-auto h-12 w-12 text-gray-200 mb-4" />
            <p className="font-semibold text-gray-400">Belum ada riwayat</p>
          </div>
        : <div className="space-y-3">
            {done.map((t,i) => (
              <div key={t.id} onClick={()=>onSelect(t)}
                className="flex cursor-pointer items-center gap-4 rounded-2xl bg-white border border-gray-100 p-4 shadow-sm transition-all hover:border-amber-200 hover:shadow-md active:scale-[0.99] animate-[fade-up_0.3s_ease_both]"
                style={{animationDelay:`${i*50}ms`}}>
                <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
                  t.status==='Disetujui' ? 'bg-emerald-100' : t.status==='Ditolak' ? 'bg-red-100' : 'bg-orange-100')}>
                  {t.status==='Disetujui' ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> :
                   t.status==='Ditolak' ? <XCircle className="h-6 w-6 text-red-500" /> : <RotateCcw className="h-6 w-6 text-orange-500" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800 truncate">{t.productName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Selesai: {t.completedAt ?? '—'} · {t.auditDurationHours ?? '?'}j</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge status={t.status} />
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}

/* ── Statistik view ─────────────────────────────────── */
function StatistikView({ tasks }: { tasks:AuditTask[] }) {
  const done     = tasks.filter(t=>t.status==='Disetujui')
  const rejected = tasks.filter(t=>t.status==='Ditolak')
  const active   = tasks.filter(t=>!['Disetujui','Ditolak'].includes(t.status))
  const avgH     = done.length>0 ? Math.round(done.reduce((s,t)=>s+(t.auditDurationHours??18),0)/done.length) : 0
  const rate     = tasks.filter(t=>t.status==='Disetujui'||t.status==='Ditolak').length > 0
    ? Math.round(done.length / tasks.filter(t=>t.status==='Disetujui'||t.status==='Ditolak').length * 100) : 0
  const cats     = tasks.reduce((acc,t)=>{ acc[t.category]=(acc[t.category]??0)+1; return acc },{} as Record<string,number>)
  const maxCat   = Math.max(...Object.values(cats),1)

  const STATS = [
    { label:'Total Audit', value:tasks.length, icon:ClipboardList, color:'#bf8a44', bg:'rgba(191,138,68,0.1)' },
    { label:'Disetujui',   value:done.length,   icon:CheckCircle2, color:'#059669', bg:'rgba(5,150,105,0.1)' },
    { label:'Rata-rata',   value:`${avgH}j`,    icon:Clock,        color:'#2563eb', bg:'rgba(37,99,235,0.1)' },
    { label:'Approval',    value:`${rate}%`,    icon:Target,       color:'#d97706', bg:'rgba(217,119,6,0.1)' },
  ]
  const ACHIEVEMENTS = [
    { icon:Star,  label:'Berpengalaman',  desc:`${tasks.length} audit`, unlocked:tasks.length>=3 },
    { icon:Zap,   label:'Audit Cepat',    desc:'<24j rata-rata',       unlocked:avgH>0&&avgH<24 },
    { icon:Award, label:'Tingkat Tinggi', desc:`${rate}% approval`,    unlocked:rate>=70 },
    { icon:Award, label:'Verifikator Pro',desc:'5+ disetujui',         unlocked:done.length>=5 },
  ]
  return (
    <div className="pb-24 lg:pb-0">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-gray-900">Statistik Kinerja</h2>
        <p className="mt-1 text-sm text-gray-500">Rekap performa audit Anda</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4">
        {STATS.map((s,i) => (
          <div key={s.label} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm animate-[fade-up_0.4s_ease_both]" style={{animationDelay:`${i*60}ms`}}>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{background:s.bg}}>
              <s.icon className="h-5 w-5" style={{color:s.color}} />
            </div>
            <p className="font-serif text-2xl font-bold" style={{color:s.color}}>{s.value}</p>
            <p className="mt-0.5 text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2"><BarChart3 className="h-4 w-4 text-amber-500" />Status Breakdown</h3>
          <div className="space-y-4">
            {[
              {l:'Disetujui',v:done.length,total:tasks.length,color:'#059669'},
              {l:'Aktif',v:active.length,total:tasks.length,color:'#bf8a44'},
              {l:'Ditolak',v:rejected.length,total:tasks.length,color:'#ef4444'},
            ].map((s,i) => (
              <div key={s.l}>
                <div className="mb-1.5 flex justify-between text-xs"><span className="text-gray-500">{s.l}</span><span className="font-bold text-gray-800">{s.v}</span></div>
                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{width:0,background:s.color,transitionDelay:`${i*150}ms`}}
                    ref={el=>{ if(el) setTimeout(()=>el.style.width=`${s.total>0?(s.v/s.total)*100:0}%`,100) }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2"><Package className="h-4 w-4 text-amber-500" />Per Kategori</h3>
          <div className="space-y-4">
            {Object.entries(cats).map(([cat,count],i) => (
              <div key={cat}>
                <div className="mb-1.5 flex justify-between text-xs"><span className="text-gray-500">{cat}</span><span className="font-bold text-gray-800">{count}</span></div>
                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{width:0,background:'linear-gradient(90deg,#bf8a44,#e8c98a)',transitionDelay:`${i*150}ms`}}
                    ref={el=>{ if(el) setTimeout(()=>el.style.width=`${(count/maxCat)*100}%`,100) }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2"><Award className="h-4 w-4 text-amber-500" />Pencapaian</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ACHIEVEMENTS.map(a => (
            <div key={a.label} className={cn('flex flex-col items-center rounded-2xl border-2 p-4 text-center transition-all',
              a.unlocked ? 'border-amber-200 bg-gradient-to-b from-amber-50 to-white' : 'border-gray-100 bg-gray-50 opacity-40')}>
              <div className={cn('mb-2 flex h-12 w-12 items-center justify-center rounded-2xl',a.unlocked ? 'bg-amber-100' : 'bg-gray-100')}>
                <a.icon className={cn('h-6 w-6',a.unlocked ? 'text-amber-500' : 'text-gray-300')} />
              </div>
              <p className="text-xs font-bold text-gray-700">{a.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{a.desc}</p>
              {a.unlocked && <span className="mt-2 text-[9px] font-bold uppercase tracking-wider text-amber-500">✓ Unlocked</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Profil view ────────────────────────────────────── */
function ProfilView({ profile, onSave }: { profile:VerifikatorProfile; onSave:(p:VerifikatorProfile)=>void }) {
  const [form, setForm] = useState(profile)
  const [saved, setSaved] = useState(false)
  const save = async () => { onSave(form); setSaved(true); setTimeout(()=>setSaved(false),2000) }
  const FIELDS: { label:string; key: keyof VerifikatorProfile; type:string }[] = [
    {label:'Nama Lengkap',key:'name',type:'text'},
    {label:'Email',key:'email',type:'email'},
    {label:'Nomor HP',key:'phone',type:'tel'},
    {label:'Nama LSM',key:'lsm',type:'text'},
    {label:'Wilayah Kerja',key:'region',type:'text'},
  ]
  return (
    <div className="pb-24 lg:pb-0">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-gray-900">Profil Saya</h2>
        <p className="mt-1 text-sm text-gray-500">Kelola informasi akun verifikator</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Avatar card */}
        <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
          <div className="h-20" style={{background:'linear-gradient(135deg,#1e1510,#3b2a1e)'}} />
          <div className="px-6 pb-6">
            <div className="-mt-10 flex justify-center mb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white text-2xl font-bold text-white shadow-lg"
                style={{background:'linear-gradient(135deg,#bf8a44,#d4a054)'}}>
                {form.avatar}
              </div>
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900">{form.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{form.lsm}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <ShieldCheck className="h-3 w-3" />Auditor Terverifikasi
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-gray-50 p-2.5">
                <p className="text-lg font-bold text-amber-600">18j</p>
                <p className="text-[10px] text-gray-400">Rata-rata</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-2.5">
                <p className="text-lg font-bold text-gray-700 truncate text-sm">{form.region}</p>
                <p className="text-[10px] text-gray-400">Wilayah</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400">Bergabung {form.joinDate}</p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
          <h3 className="mb-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Edit Informasi</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map(f => (
              <div key={f.key} className={f.key==='lsm'?'sm:col-span-2':''}>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{f.label}</label>
                <input type={f.type} value={form[f.key] as string}
                  onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 focus:bg-white" />
              </div>
            ))}
          </div>
          <button onClick={save}
            className={cn('mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition-all active:scale-95',
              saved ? 'bg-emerald-600' : '')}
            style={saved ? {} : {background:'linear-gradient(135deg,#bf8a44,#d4a054)'}}>
            {saved ? <><CheckCircle2 className="h-4 w-4" />Tersimpan!</> : 'Simpan Perubahan'}
          </button>
        </div>

        {/* Sertifikat */}
        <div className="lg:col-span-3 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2"><Award className="h-4 w-4 text-amber-500" />Dokumen & Sertifikat</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[{n:'Sertifikat Auditor LSM',d:'Berlaku s/d Des 2026'},{n:'Lisensi Verifikator CSRD',d:'Berlaku s/d Jun 2027'},{n:'Pelatihan EU ESRS',d:'Selesai Jan 2024'}].map(d=>(
              <div key={d.n} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100"><FileText className="h-5 w-5 text-amber-600" /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{d.n}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{d.d}</p>
                </div>
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
type View = 'dashboard'|'antrian'|'riwayat'|'statistik'|'profil'

export default function VerifikatorPage() {
  const [tasks,    setTasks]    = useState<AuditTask[]>([])
  const [notifs,   setNotifs]   = useState<Notification[]>([])
  const [profile,  setProfile]  = useState<VerifikatorProfile|null>(null)
  const [view,     setView]     = useState<View>('dashboard')
  const [selected, setSelected] = useState<AuditTask|null>(null)
  const [filter,   setFilter]   = useState<AuditTaskStatus|'Semua'>('Semua')
  const [search,   setSearch]   = useState('')
  const [showNotif,setShowNotif]= useState(false)
  const [showSearch,setShowSearch]=useState(false)

  useEffect(() => {
    setTasks(getStoredAuditTasks())
    setNotifs(getStoredNotifications())
    setProfile(getVerifikatorProfile())
  }, [])

  const saveTasks = useCallback((t:AuditTask[]) => { setTasks(t); saveStoredAuditTasks(t) }, [])
  const handleUpdate = useCallback((u:AuditTask) => { saveTasks(tasks.map(t=>t.id===u.id?u:t)); setSelected(u) }, [tasks,saveTasks])
  const handleSelect = useCallback((t:AuditTask) => { setSelected(t); setView('antrian') }, [])
  const handleMarkAll = () => { markAllNotifsRead(); setNotifs(p=>p.map(n=>({...n,isRead:true}))) }
  const handleSaveProfile = (p:VerifikatorProfile) => { setProfile(p); saveVerifikatorProfile(p) }

  const unread = notifs.filter(n=>!n.isRead).length
  const active  = tasks.filter(t=>!['Disetujui','Ditolak'].includes(t.status))
  const waiting = tasks.filter(t=>t.status==='Menunggu Review'||t.status==='Menunggu Data Pengrajin')
  const done    = tasks.filter(t=>t.status==='Disetujui')
  const overdue = active.filter(t=>isOverdue(t.deadline))

  const filtered = tasks.filter(t=>
    (filter==='Semua'||t.status===filter) &&
    (search===''||t.productName.toLowerCase().includes(search.toLowerCase())||t.productQr.toLowerCase().includes(search.toLowerCase()))
  )

  const NAV: {key:View;label:string;icon:React.ComponentType<{className?:string}>;badge?:number}[] = [
    {key:'dashboard', label:'Dashboard', icon:Home},
    {key:'antrian',   label:'Antrian',   icon:ClipboardList, badge:active.length},
    {key:'riwayat',   label:'Riwayat',   icon:History},
    {key:'statistik', label:'Statistik', icon:BarChart3},
    {key:'profil',    label:'Profil',    icon:User},
  ]

  const navigate = (v: View) => { setView(v); setSelected(null) }

  return (
    <div className="min-h-screen" style={{background:'#f5f4f1'}}>
      {/* ══ HEADER ══ */}
      <header className="sticky top-0 z-40" style={{background:'linear-gradient(135deg,#1a1008 0%,#2a1a0e 50%,#1e1510 100%)'}}>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <PintalLogo markClassName="[&_path]:stroke-white [&_rect:first-of-type]:fill-white" textClassName="text-white" />
            <span className="h-4 w-px bg-white/20" />
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
              <ShieldCheck className="h-3 w-3" />Verifikator
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center lg:flex">
            {NAV.map(n=>(
              <button key={n.key} onClick={()=>navigate(n.key)}
                className={cn('relative flex items-center gap-1.5 px-4 py-5 text-xs font-semibold transition-all border-b-2',
                  view===n.key ? 'border-amber-400 text-amber-400' : 'border-transparent text-white/50 hover:text-white/80')}>
                <n.icon className="h-3.5 w-3.5" />{n.label}
                {n.badge && n.badge>0 ? <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">{n.badge}</span> : null}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button onClick={()=>setShowNotif(p=>!p)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all">
                <Bell className="h-5 w-5" />
                {unread>0 && <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">{unread}</span>}
              </button>
              {showNotif && <NotifPanel notifs={notifs} onClose={()=>setShowNotif(false)} onMarkAll={handleMarkAll} onTask={id=>{const t=tasks.find(x=>x.id===id);if(t)handleSelect(t)}} />}
            </div>
            <button onClick={()=>navigate('profil')}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-amber-900 ring-2 ring-amber-400/30 transition-all hover:ring-amber-400/60"
              style={{background:'linear-gradient(135deg,#e8c98a,#bf8a44)'}}>
              {profile?.avatar ?? 'AF'}
            </button>
          </div>
        </div>

        {/* Mobile bottom tabs placeholder (real one is at bottom) */}
      </header>

      {/* ══ MAIN CONTENT ══ */}
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">

        {/* ── DASHBOARD ── */}
        {view==='dashboard' && !selected && (
          <div className="animate-[fade-up_0.35s_ease_both] pb-24 lg:pb-0">
            {/* Welcome hero */}
            <div className="mb-6 overflow-hidden rounded-2xl shadow-xl" style={{background:'linear-gradient(135deg,#1a1008 0%,#3b2a1e 60%,#2e1e10 100%)'}}>
              <div className="relative p-6">
                {/* Decorative circles */}
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10" style={{background:'radial-gradient(circle,#bf8a44,transparent)'}} />
                <div className="absolute right-16 bottom-0 h-20 w-20 rounded-full opacity-5" style={{background:'radial-gradient(circle,#e8c98a,transparent)'}} />
                <div className="relative">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-400">{profile?.lsm ?? 'LSM Tunas Nusantara'}</span>
                  </div>
                  <h1 className="font-serif text-3xl font-bold text-white mt-2">Halo, <span style={{color:'#e8c98a'}}>{profile?.name?.split(' ')[0] ?? 'Ahmad'}</span> 👋</h1>
                  <p className="mt-1 text-sm text-white/50">Selamat bertugas sebagai auditor LSM</p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      {v:active.length,  l:'Aktif',    c:'#e8c98a'},
                      {v:waiting.length, l:'Menunggu', c:'#f97316'},
                      {v:done.length,    l:'Selesai',  c:'#10b981'},
                    ].map(s=>(
                      <div key={s.l} className="rounded-xl px-3 py-2.5 text-center" style={{background:'rgba(255,255,255,0.07)'}}>
                        <p className="font-serif text-2xl font-bold" style={{color:s.c}}>{s.v}</p>
                        <p className="text-xs text-white/40">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Overdue alert */}
            {overdue.length>0 && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm animate-[fade-up_0.4s_ease_both]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100"><AlertTriangle className="h-5 w-5 text-red-500" /></div>
                <div className="flex-1">
                  <p className="font-bold text-red-700">{overdue.length} tugas melewati deadline!</p>
                  <p className="text-xs text-red-500 mt-0.5">{overdue.map(t=>t.productName).join(', ')}</p>
                </div>
                <button onClick={()=>setView('antrian')} className="shrink-0 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 active:scale-95 transition-all">Lihat</button>
              </div>
            )}

            {/* Task grid */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-gray-900">Tugas Aktif</h2>
                <button onClick={()=>setView('antrian')} className="text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors">Semua →</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {active.slice(0,3).map((t,i)=>{
                  const msgs = (t.messages??[]).filter(m=>!m.isRead).length
                  return (
                    <div key={t.id} onClick={()=>handleSelect(t)}
                      className="cursor-pointer group rounded-2xl bg-white border border-gray-100 p-4 shadow-sm transition-all hover:border-amber-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] animate-[fade-up_0.4s_ease_both]"
                      style={{animationDelay:`${i*80}ms`}}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-bold text-gray-800 text-sm leading-snug flex-1 min-w-0 truncate">{t.productName}</p>
                        <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <StatusBadge status={t.status} />
                        <PriorityBadge priority={t.priority} />
                        <DeadlineChip deadline={t.deadline} status={t.status} />
                        {msgs>0 && <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 ring-1 ring-blue-200"><MessageSquare className="h-2.5 w-2.5" />{msgs}</span>}
                      </div>
                      <GoldBar value={t.progress} delay={i*120} />
                      <p className="mt-1.5 text-right text-xs font-bold text-amber-600">{t.progress}%</p>
                    </div>
                  )
                })}
                {active.length===0 && (
                  <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 text-emerald-300 mb-3" />
                    <p className="font-semibold text-gray-400">Semua tugas selesai!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {l:'Riwayat', desc:`${done.length} selesai`, icon:History,   v:'riwayat' as View},
                {l:'Statistik',desc:'Kinerja',               icon:BarChart3, v:'statistik' as View},
                {l:'Profil',  desc:profile?.name?.split(' ')[0]??'Ahmad',icon:Settings,v:'profil' as View},
              ].map(q=>(
                <button key={q.l} onClick={()=>navigate(q.v)}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-white border border-gray-100 p-4 shadow-sm transition-all hover:border-amber-200 hover:shadow-md active:scale-95">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50"><q.icon className="h-5 w-5 text-amber-600" /></div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-700">{q.l}</p>
                    <p className="text-[10px] text-gray-400">{q.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── ANTRIAN ── */}
        {view==='antrian' && (
          selected
            ? <DetailPanel task={selected} onBack={()=>setSelected(null)} onUpdate={handleUpdate} />
            : (
              <div className="animate-[fade-up_0.3s_ease_both] pb-24 lg:pb-0">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-gray-900">Antrian Audit</h2>
                    <p className="text-sm text-gray-500">{filtered.length} dari {tasks.length} tugas</p>
                  </div>
                  <button onClick={()=>setShowSearch(p=>!p)}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm hover:border-amber-300 transition-all active:scale-95">
                    <Search className="h-4 w-4" />Cari Produk
                  </button>
                </div>
                {showSearch && (
                  <div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-200 bg-white px-4 py-3 shadow-sm">
                    <Search className="h-4 w-4 text-amber-500 shrink-0" />
                    <input value={search} onChange={e=>setSearch(e.target.value)} autoFocus placeholder="Nama produk atau QR code..."
                      className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none" />
                    {search && <button onClick={()=>setSearch('')}><X className="h-4 w-4 text-gray-400 hover:text-gray-600" /></button>}
                  </div>
                )}
                <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
                  {(['Semua','Menunggu Review','Sedang Diaudit','Menunggu Data Pengrajin','Data Pengrajin Masuk'] as const).map(f=>(
                    <button key={f} onClick={()=>setFilter(f)}
                      className={cn('shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95',
                        filter===f ? 'border-transparent text-white shadow-sm' : 'border-gray-200 bg-white text-gray-500 hover:border-amber-300 hover:text-amber-600')}
                      style={filter===f ? {background:'linear-gradient(135deg,#1e1510,#3b2a1e)'} : {}}>
                      {f}
                    </button>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((t,i) => {
                    const msgs=(t.messages??[]).filter(m=>!m.isRead).length
                    const over = isOverdue(t.deadline)&&!['Disetujui','Ditolak'].includes(t.status)
                    return (
                      <div key={t.id} onClick={()=>setSelected(t)}
                        className={cn('cursor-pointer group rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] animate-[fade-up_0.3s_ease_both]',
                          over ? 'border-2 border-red-200' : 'border border-gray-100 hover:border-amber-200')}
                        style={{animationDelay:`${i*60}ms`}}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <p className="truncate font-serif font-bold text-gray-900 text-[15px]">{t.productName}</p>
                            <code className="text-[10px] font-mono text-gray-400">{t.productQr}</code>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-gray-200 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all mt-0.5" />
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <StatusBadge status={t.status} />
                          <PriorityBadge priority={t.priority} />
                          <DeadlineChip deadline={t.deadline} status={t.status} />
                          {msgs>0 && <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 ring-1 ring-blue-200"><MessageSquare className="h-2.5 w-2.5" />{msgs} pesan</span>}
                        </div>
                        <div className="mb-1 flex justify-between text-xs"><span className="text-gray-400">{t.checklistItems.filter(c=>c.checked).length}/{t.checklistItems.length} ✓</span><span className="font-bold text-amber-600">{t.progress}%</span></div>
                        <GoldBar value={t.progress} delay={i*80} />
                        <p className="mt-3 text-xs text-gray-400">{t.brandName}</p>
                      </div>
                    )
                  })}
                  {filtered.length===0 && (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
                      <ClipboardList className="h-12 w-12 text-gray-200 mb-4" />
                      <p className="font-semibold text-gray-400">Tidak ada tugas ditemukan</p>
                    </div>
                  )}
                </div>
              </div>
            )
        )}

        {view==='riwayat' && !selected && <RiwayatView tasks={tasks} onSelect={handleSelect} />}
        {view==='riwayat' &&  selected && <DetailPanel task={selected} onBack={()=>setSelected(null)} onUpdate={handleUpdate} />}
        {view==='statistik' && <StatistikView tasks={tasks} />}
        {view==='profil' && profile && <ProfilView profile={profile} onSave={handleSaveProfile} />}
      </main>

      {/* ══ MOBILE BOTTOM NAV ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden" style={{background:'rgba(26,16,8,0.97)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(255,255,255,0.07)'}}>
        <div className="flex items-stretch">
          {NAV.map(n=>(
            <button key={n.key} onClick={()=>navigate(n.key)}
              className={cn('relative flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-all',
                view===n.key ? 'text-amber-400' : 'text-white/35 hover:text-white/60')}>
              {view===n.key && <span className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-amber-400" />}
              <n.icon className={cn('h-5 w-5 transition-transform', view===n.key && 'scale-110')} />
              <span className={cn('text-[10px] font-semibold', view===n.key ? 'text-amber-400' : '')}>{n.label}</span>
              {n.badge && n.badge>0 ? <span className="absolute right-2.5 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">{n.badge}</span> : null}
            </button>
          ))}
        </div>
        {/* iPhone home bar spacer */}
        <div className="h-safe-bottom" style={{paddingBottom:'env(safe-area-inset-bottom)'}} />
      </div>
    </div>
  )
}
