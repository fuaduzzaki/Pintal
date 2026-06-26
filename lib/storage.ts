import { PRODUCTS, type Product } from './dashboard-data'

export type Report = {
  id: number
  name: string
  date: string
  products: number
  format: string
  status: 'Selesai' | 'Draft'
  size: string
}

export type AuditTaskStatus =
  | 'Menunggu Review'
  | 'Sedang Diaudit'
  | 'Menunggu Data Pengrajin'
  | 'Data Pengrajin Masuk'
  | 'Disetujui'
  | 'Revisi'
  | 'Ditolak'

export type ChatMessage = {
  id: string
  sender: 'verifikator' | 'brand' | 'pengrajin'
  senderName: string
  message: string
  timestamp: string
  isRead: boolean
}

export type AuditTask = {
  id: string
  productName: string
  productQr: string
  brandName: string
  brandEmail: string
  material: string
  provinsi: string
  proses: string[]
  komposisi: string
  description: string
  category: string
  submittedAt: string
  deadline: string
  status: AuditTaskStatus
  progress: number
  priority: 'Tinggi' | 'Sedang' | 'Rendah'
  verifikatorNote?: string
  completedAt?: string
  auditDurationHours?: number
  artisanData?: {
    bahan: string
    provinsi: string
    proses: string
    tanggal: string
    jumlah: string
    teknik: string
    catatan: string
    submittedAt: string
  }
  checklistItems: {
    id: string
    label: string
    checked: boolean
  }[]
  messages: ChatMessage[]
}

export type Notification = {
  id: string
  title: string
  body: string
  type: 'new_task' | 'artisan_data' | 'deadline' | 'system'
  isRead: boolean
  timestamp: string
  taskId?: string
}

export type VerifikatorProfile = {
  name: string
  email: string
  phone: string
  lsm: string
  region: string
  joinDate: string
  avatar: string
}

const PRODUCTS_KEY      = 'pintal_products'
const REPORTS_KEY       = 'pintal_reports'
const AUDIT_TASKS_KEY   = 'pintal_audit_tasks_v2'
const NOTIF_KEY         = 'pintal_notifications_v2'
const PROFILE_KEY       = 'pintal_verifikator_profile_v2'

/* ── helpers ─────────────────────────────────────────── */
function addDays(base: Date, days: number) {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const DEFAULT_CHECKLIST = [
  { id: 'dok_pengrajin',       label: 'Dokumen pengrajin lengkap & valid',      checked: false },
  { id: 'foto_produk',         label: 'Foto produk sesuai deskripsi',            checked: false },
  { id: 'bahan_terverifikasi', label: 'Bahan baku terverifikasi asal usulnya',   checked: false },
  { id: 'proses_produksi',     label: 'Proses produksi sesuai standar',          checked: false },
  { id: 'pewarna_aman',        label: 'Pewarna aman & ramah lingkungan',         checked: false },
  { id: 'kunjungan_lapangan',  label: 'Kunjungan lapangan telah dilakukan',      checked: false },
  { id: 'data_pengrajin',      label: 'Data pengrajin sudah diinput & valid',    checked: false },
]

const INITIAL_AUDIT_TASKS: AuditTask[] = [
  {
    id: 'TASK-001',
    productName: 'Lurik Klaten Modern',
    productQr: '3E8D-LRK-0028',
    brandName: 'Sanggar Wastra Nusantara',
    brandEmail: 'arini@sanggarwastra.id',
    material: 'Katun organik',
    provinsi: 'Jawa Tengah',
    proses: ['Tenun ATBM', 'Pewarna Alam'],
    komposisi: '100% Katun Organik',
    description: 'Lurik motif modern dengan bahan ramah lingkungan',
    category: 'Lurik',
    submittedAt: '06 Mei 2026',
    deadline: addDays(new Date(), 1),
    priority: 'Tinggi',
    status: 'Sedang Diaudit',
    progress: 65,
    checklistItems: DEFAULT_CHECKLIST.map((c, i) => ({ ...c, checked: i < 4 })),
    artisanData: {
      bahan: 'Benang katun organik lokal',
      provinsi: 'Jawa Tengah',
      proses: 'Tenun menggunakan alat tenun bukan mesin (ATBM) tradisional warisan leluhur.',
      tanggal: '2026-04-20',
      jumlah: '35',
      teknik: 'Tenun ATBM',
      catatan: 'Pewarna menggunakan daun jati dan kulit kayu mahoni.',
      submittedAt: '22 Apr 2026',
    },
    messages: [
      { id: 'm1', sender: 'brand', senderName: 'Arini Kusuma', message: 'Selamat pagi Pak Ahmad, apakah ada dokumen tambahan yang perlu kami siapkan?', timestamp: '08 Mei 2026, 09:15', isRead: true },
      { id: 'm2', sender: 'verifikator', senderName: 'Ahmad Fauzi', message: 'Selamat pagi Bu Arini. Dokumen sudah lengkap, tinggal proses kunjungan lapangan ke Klaten minggu depan.', timestamp: '08 Mei 2026, 10:30', isRead: true },
      { id: 'm3', sender: 'brand', senderName: 'Arini Kusuma', message: 'Siap Pak, kami akan koordinasikan dengan pengrajin di sana.', timestamp: '08 Mei 2026, 10:45', isRead: false },
    ],
  },
  {
    id: 'TASK-002',
    productName: 'Songket Palembang',
    productQr: '5A4F-SGK-0019',
    brandName: 'Sanggar Wastra Nusantara',
    brandEmail: 'arini@sanggarwastra.id',
    material: 'Benang emas, sutra',
    provinsi: 'Sumatera',
    proses: ['Batik Tulis'],
    komposisi: '60% Sutra + 40% Benang Emas',
    description: 'Songket premium Palembang dengan benang emas asli',
    category: 'Songket',
    submittedAt: '02 Mei 2026',
    deadline: addDays(new Date(), 3),
    priority: 'Sedang',
    status: 'Menunggu Data Pengrajin',
    progress: 40,
    checklistItems: DEFAULT_CHECKLIST.map((c, i) => ({ ...c, checked: i < 2 })),
    messages: [
      { id: 'm4', sender: 'brand', senderName: 'Arini Kusuma', message: 'Pak Ahmad, kami sudah menghubungi pengrajin Songket untuk mengisi data. Mohon ditunggu ya.', timestamp: '04 Mei 2026, 14:00', isRead: true },
    ],
  },
  {
    id: 'TASK-003',
    productName: 'Tenun Gringsing Bali',
    productQr: '1B9C-GRS-0011',
    brandName: 'Sanggar Wastra Nusantara',
    brandEmail: 'arini@sanggarwastra.id',
    material: 'Katun pewarna alam',
    provinsi: 'Bali',
    proses: ['Tenun ATBM', 'Pewarna Alam', 'Organik Certified'],
    komposisi: '100% Katun Alam',
    description: 'Tenun gringsing langka dari Desa Tenganan Bali',
    category: 'Tenun',
    submittedAt: '28 Apr 2026',
    deadline: addDays(new Date(), 7),
    priority: 'Rendah',
    status: 'Menunggu Review',
    progress: 10,
    checklistItems: DEFAULT_CHECKLIST.map(c => ({ ...c, checked: false })),
    messages: [],
  },
  {
    id: 'TASK-004',
    productName: 'Tenun Ikat Sumba',
    productQr: '9F2A-SUMBA-0042',
    brandName: 'Sanggar Wastra Nusantara',
    brandEmail: 'arini@sanggarwastra.id',
    material: 'Katun pewarna alam',
    provinsi: 'NTT',
    proses: ['Tenun ATBM', 'Pewarna Alam'],
    komposisi: '100% Katun',
    description: 'Tenun ikat premium dari Sumba Timur',
    category: 'Tenun',
    submittedAt: '10 Apr 2026',
    deadline: addDays(new Date(), -5),
    priority: 'Tinggi',
    status: 'Disetujui',
    progress: 100,
    completedAt: '25 Apr 2026',
    auditDurationHours: 18,
    checklistItems: DEFAULT_CHECKLIST.map(c => ({ ...c, checked: true })),
    verifikatorNote: 'Semua dokumen valid, kunjungan lapangan sudah dilakukan. Produk memenuhi standar CSRD.',
    artisanData: {
      bahan: 'Benang katun alam dari Sumba Timur',
      provinsi: 'NTT',
      proses: 'Tenun ikat dengan teknik tradisional Sumba yang diwariskan turun-temurun.',
      tanggal: '2026-04-05',
      jumlah: '20',
      teknik: 'Tenun ATBM',
      catatan: 'Pewarna alami dari tanaman lokal Sumba.',
      submittedAt: '12 Apr 2026',
    },
    messages: [
      { id: 'm5', sender: 'verifikator', senderName: 'Ahmad Fauzi', message: 'Audit selesai. Passport sudah disetujui dan QR aktif. Selamat Bu Arini!', timestamp: '25 Apr 2026, 16:00', isRead: true },
    ],
  },
  {
    id: 'TASK-005',
    productName: 'Batik Tulis Pekalongan',
    productQr: '7C1B-BTK-0031',
    brandName: 'Sanggar Wastra Nusantara',
    brandEmail: 'arini@sanggarwastra.id',
    material: 'Sutra ATBM',
    provinsi: 'Jawa Tengah',
    proses: ['Batik Tulis', 'Pewarna Alam'],
    komposisi: '100% Sutra',
    description: 'Batik tulis premium dari Pekalongan',
    category: 'Batik',
    submittedAt: '15 Mar 2026',
    deadline: addDays(new Date(), -10),
    priority: 'Sedang',
    status: 'Ditolak',
    progress: 30,
    completedAt: '01 Apr 2026',
    auditDurationHours: 36,
    checklistItems: DEFAULT_CHECKLIST.map((c, i) => ({ ...c, checked: i < 2 })),
    verifikatorNote: 'Dokumen pengrajin tidak lengkap. Surat keterangan asal bahan tidak ada. Mohon dilengkapi dan ajukan ulang.',
    messages: [
      { id: 'm6', sender: 'verifikator', senderName: 'Ahmad Fauzi', message: 'Maaf Bu Arini, pengajuan ini harus kami tolak karena dokumen tidak lengkap. Silakan ajukan ulang setelah melengkapi surat keterangan pengrajin.', timestamp: '01 Apr 2026, 11:00', isRead: true },
    ],
  },
]

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Tugas Baru Masuk', body: 'Tenun Gringsing Bali menunggu review Anda.', type: 'new_task', isRead: false, timestamp: '28 Apr 2026, 08:00', taskId: 'TASK-003' },
  { id: 'n2', title: 'Data Pengrajin Masuk', body: 'Pengrajin sudah mengisi data untuk Lurik Klaten Modern.', type: 'artisan_data', isRead: false, timestamp: '22 Apr 2026, 14:30', taskId: 'TASK-001' },
  { id: 'n3', title: 'Deadline Mendekat', body: 'Songket Palembang deadline dalam 3 hari.', type: 'deadline', isRead: true, timestamp: '02 Mei 2026, 09:00', taskId: 'TASK-002' },
  { id: 'n4', title: 'Passport Disetujui', body: 'Tenun Ikat Sumba berhasil mendapatkan passport.', type: 'system', isRead: true, timestamp: '25 Apr 2026, 16:05' },
]

const DEFAULT_PROFILE: VerifikatorProfile = {
  name: 'Ahmad Fauzi',
  email: 'ahmad.fauzi@lsm-tunasnusantara.org',
  phone: '0812-3456-7890',
  lsm: 'LSM Tunas Nusantara',
  region: 'Jawa & Bali',
  joinDate: 'Januari 2024',
  avatar: 'AF',
}

/* ── Products ───────────────────────────── */
export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return PRODUCTS
  const stored = localStorage.getItem(PRODUCTS_KEY)
  if (!stored) { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(PRODUCTS)); return PRODUCTS }
  try { return JSON.parse(stored) } catch { return PRODUCTS }
}
export function saveStoredProducts(products: Product[]) {
  if (typeof window !== 'undefined') localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

/* ── Reports ────────────────────────────── */
export function getStoredReports(): Report[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(REPORTS_KEY)
  if (!stored) {
    const initial: Report[] = [
      { id: 1, name: 'CSRD Q1 2026 — Tenun & Batik', date: '12 Apr 2026', products: 8, format: 'PDF', status: 'Selesai', size: '2.4 MB' },
      { id: 2, name: 'EPR Export Report — Sumba Collection', date: '28 Mar 2026', products: 5, format: 'PDF', status: 'Selesai', size: '1.8 MB' },
      { id: 3, name: 'Draft CSRD Q2 2026', date: '15 Mei 2026', products: 3, format: 'PDF', status: 'Draft', size: '0.9 MB' },
    ]
    localStorage.setItem(REPORTS_KEY, JSON.stringify(initial))
    return initial
  }
  try { return JSON.parse(stored) } catch { return [] }
}
export function saveStoredReports(reports: Report[]) {
  if (typeof window !== 'undefined') localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
}

/* ── Audit Tasks ────────────────────────── */
export function getStoredAuditTasks(): AuditTask[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_TASKS
  const stored = localStorage.getItem(AUDIT_TASKS_KEY)
  if (!stored) { localStorage.setItem(AUDIT_TASKS_KEY, JSON.stringify(INITIAL_AUDIT_TASKS)); return INITIAL_AUDIT_TASKS }
  try { return JSON.parse(stored) } catch { return INITIAL_AUDIT_TASKS }
}
export function saveStoredAuditTasks(tasks: AuditTask[]) {
  if (typeof window !== 'undefined') localStorage.setItem(AUDIT_TASKS_KEY, JSON.stringify(tasks))
}
export function addAuditTask(task: AuditTask) {
  const tasks = getStoredAuditTasks()
  tasks.unshift(task)
  saveStoredAuditTasks(tasks)
  // add notification
  const notif: Notification = {
    id: `n-${Date.now()}`,
    title: 'Tugas Baru Masuk',
    body: `${task.productName} menunggu review Anda.`,
    type: 'new_task',
    isRead: false,
    timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    taskId: task.id,
  }
  const notifs = getStoredNotifications()
  notifs.unshift(notif)
  saveStoredNotifications(notifs)
}
export function updateAuditTask(id: string, updates: Partial<AuditTask>) {
  const tasks = getStoredAuditTasks()
  const idx = tasks.findIndex(t => t.id === id)
  if (idx !== -1) { tasks[idx] = { ...tasks[idx], ...updates }; saveStoredAuditTasks(tasks) }
}

/* ── Notifications ──────────────────────── */
export function getStoredNotifications(): Notification[] {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS
  const stored = localStorage.getItem(NOTIF_KEY)
  if (!stored) { localStorage.setItem(NOTIF_KEY, JSON.stringify(INITIAL_NOTIFICATIONS)); return INITIAL_NOTIFICATIONS }
  try { return JSON.parse(stored) } catch { return INITIAL_NOTIFICATIONS }
}
export function saveStoredNotifications(notifs: Notification[]) {
  if (typeof window !== 'undefined') localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs))
}
export function markNotifRead(id: string) {
  const notifs = getStoredNotifications()
  const idx = notifs.findIndex(n => n.id === id)
  if (idx !== -1) { notifs[idx].isRead = true; saveStoredNotifications(notifs) }
}
export function markAllNotifsRead() {
  const notifs = getStoredNotifications().map(n => ({ ...n, isRead: true }))
  saveStoredNotifications(notifs)
}

/* ── Profile ────────────────────────────── */
export function getVerifikatorProfile(): VerifikatorProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE
  const stored = localStorage.getItem(PROFILE_KEY)
  if (!stored) { localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE)); return DEFAULT_PROFILE }
  try { return JSON.parse(stored) } catch { return DEFAULT_PROFILE }
}
export function saveVerifikatorProfile(profile: VerifikatorProfile) {
  if (typeof window !== 'undefined') localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}
