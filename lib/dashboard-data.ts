export type AuditStatus = 'Terverifikasi' | 'Proses Audit' | 'Menunggu Input'

export type Product = {
  name: string
  qr: string
  material: string
  status: AuditStatus
  date: string
  progress: number
}

export const SUMMARY = [
  { key: 'Total Produk Terdaftar', value: '48', sub: '+6 bulan ini' },
  { key: 'QR Code Aktif', value: '41', sub: '85% dari produk' },
  { key: 'Audit LSM Selesai', value: '37', sub: '4 dalam proses' },
  { key: 'Laporan CSRD Tersedia', value: '12', sub: 'Kuartal berjalan' },
]

export const PRODUCTS: Product[] = [
  {
    name: 'Tenun Ikat Sumba',
    qr: '9F2A-SUMBA-0042',
    material: 'Katun pewarna alam',
    status: 'Terverifikasi',
    date: '12 Mei 2026',
    progress: 100,
  },
  {
    name: 'Batik Tulis Pekalongan',
    qr: '7C1B-BTK-0031',
    material: 'Sutra ATBM',
    status: 'Terverifikasi',
    date: '09 Mei 2026',
    progress: 100,
  },
  {
    name: 'Lurik Klaten Modern',
    qr: '3E8D-LRK-0028',
    material: 'Katun organik',
    status: 'Proses Audit',
    date: '06 Mei 2026',
    progress: 65,
  },
  {
    name: 'Songket Palembang',
    qr: '5A4F-SGK-0019',
    material: 'Benang emas, sutra',
    status: 'Proses Audit',
    date: '02 Mei 2026',
    progress: 40,
  },
  {
    name: 'Tenun Gringsing Bali',
    qr: '1B9C-GRS-0011',
    material: 'Katun pewarna alam',
    status: 'Menunggu Input',
    date: '28 Apr 2026',
    progress: 10,
  },
]

export const AUDIT_QUEUE = PRODUCTS.filter(
  (p) => p.status !== 'Terverifikasi',
).map((p) => ({ name: p.name, status: p.status, progress: p.progress }))
