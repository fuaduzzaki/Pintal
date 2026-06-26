import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import type {
  AuditRecord,
  MaterialPassport,
  ProductSubmission,
} from './types'

const DATA_DIR = path.join(process.cwd(), '.data')
const STORE_FILE = path.join(DATA_DIR, 'store.json')

interface Store {
  submissions: ProductSubmission[]
  passports: MaterialPassport[]
  auditRecords: AuditRecord[]
  uploads: Record<string, string>
}

const BRAND_ID = 'brand-1'
const ARTISAN_ID = 'artisan-1'

function seedStore(): Store {
  const now = new Date().toISOString()
  const submissions: ProductSubmission[] = [
    {
      id: 'sub-001',
      artisanId: ARTISAN_ID,
      artisanName: 'Ibu Maria Mbiri',
      brandId: BRAND_ID,
      productName: 'Tenun Ikat Sumba',
      productType: 'Tenun',
      materialOrigin: 'Waingapu, NTT',
      fiberType: 'Katun pewarna alam',
      dyeMethod: 'Pewarna alami indigo',
      productionProcess: 'Tenun ikat tradisional dengan benang katun alam dari petani lokal Sumba Timur.',
      photos: [],
      geoLocation: { lat: -9.656, lng: 120.264, address: 'Waingapu, NTT' },
      status: 'approved',
      submittedAt: '2026-05-12T08:00:00.000Z',
      updatedAt: now,
    },
    {
      id: 'sub-002',
      artisanId: ARTISAN_ID,
      artisanName: 'Ibu Maria Mbiri',
      brandId: BRAND_ID,
      productName: 'Batik Tulis Pekalongan',
      productType: 'Batik',
      materialOrigin: 'Pekalongan, Jawa Tengah',
      fiberType: 'Sutra ATBM',
      dyeMethod: 'Pewarna alami',
      productionProcess: 'Batik tulis dengan canting tradisional menggunakan lilin alami dan pewarna botani.',
      photos: [],
      geoLocation: { lat: -6.889, lng: 109.675, address: 'Pekalongan, Jawa Tengah' },
      status: 'approved',
      submittedAt: '2026-05-09T08:00:00.000Z',
      updatedAt: now,
    },
    {
      id: 'sub-003',
      artisanId: ARTISAN_ID,
      artisanName: 'Ibu Maria Mbiri',
      brandId: BRAND_ID,
      productName: 'Lurik Klaten Modern',
      productType: 'Lurik',
      materialOrigin: 'Klaten, Jawa Tengah',
      fiberType: 'Katun organik',
      dyeMethod: 'Pewarna alami indigo',
      productionProcess: 'Tenun lurik dengan motif modern menggunakan katun organik lokal Klaten.',
      photos: [],
      geoLocation: { lat: -7.706, lng: 110.604, address: 'Klaten, Jawa Tengah' },
      status: 'pending_audit',
      submittedAt: '2026-05-06T08:00:00.000Z',
      updatedAt: now,
    },
    {
      id: 'sub-004',
      artisanId: ARTISAN_ID,
      artisanName: 'Ibu Maria Mbiri',
      brandId: BRAND_ID,
      productName: 'Songket Palembang',
      productType: 'Songket',
      materialOrigin: 'Palembang, Sumatera Selatan',
      fiberType: 'Benang emas, sutra',
      dyeMethod: 'Pewarna sintetis ramah lingkungan',
      productionProcess: 'Songket tenun dengan benang emas asli Palembang menggunakan teknik tradisional.',
      photos: [],
      geoLocation: { lat: -2.991, lng: 104.756, address: 'Palembang, Sumatera Selatan' },
      status: 'in_review',
      submittedAt: '2026-05-02T08:00:00.000Z',
      updatedAt: now,
    },
    {
      id: 'sub-005',
      artisanId: ARTISAN_ID,
      artisanName: 'Ibu Maria Mbiri',
      brandId: BRAND_ID,
      productName: 'Tenun Gringsing Bali',
      productType: 'Tenun',
      materialOrigin: 'Tenganan, Bali',
      fiberType: 'Katun pewarna alam',
      dyeMethod: 'Pewarna alami',
      productionProcess: 'Tenun gringsing double ikat langka dari Desa Tenganan Pegringsingan.',
      photos: [],
      geoLocation: { lat: -8.409, lng: 115.189, address: 'Tenganan, Bali' },
      status: 'rejected',
      submittedAt: '2026-04-28T08:00:00.000Z',
      updatedAt: now,
    },
  ]

  const passports: MaterialPassport[] = [
    createPassportFromSubmission(submissions[0], 'Ahmad Fauzi', 'LSM Tunas Nusantara', '2026-05-12T10:00:00.000Z'),
    createPassportFromSubmission(submissions[1], 'Ahmad Fauzi', 'LSM Tunas Nusantara', '2026-05-09T10:00:00.000Z'),
  ]

  return { submissions, passports, auditRecords: [], uploads: {} }
}

function createPassportFromSubmission(
  submission: ProductSubmission,
  auditorName: string,
  auditorOrg: string,
  auditDate: string,
): MaterialPassport {
  const generatedAt = auditDate
  const expiresAt = new Date(new Date(generatedAt).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
  const id = randomUUID()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return {
    id,
    submissionId: submission.id,
    brandId: submission.brandId,
    qrCodeUrl: `${baseUrl}/passport/${id}`,
    passportData: {
      productName: submission.productName,
      productType: submission.productType,
      artisanName: submission.artisanName,
      artisanLocation: submission.geoLocation?.address ?? submission.materialOrigin,
      materialOrigin: submission.materialOrigin,
      fiberType: submission.fiberType,
      dyeMethod: submission.dyeMethod,
      productionProcess: submission.productionProcess,
      photos: submission.photos,
      auditedBy: auditorName,
      auditorOrganization: auditorOrg,
      auditDate,
      csrdCompliant: true,
      epCompliant: true,
    },
    status: 'active',
    generatedAt,
    expiresAt,
  }
}

function readStore(): Store {
  try {
    if (!fs.existsSync(STORE_FILE)) {
      const seed = seedStore()
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
      fs.writeFileSync(STORE_FILE, JSON.stringify(seed, null, 2))
      return seed
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf-8')
    return JSON.parse(raw) as Store
  } catch {
    return seedStore()
  }
}

function writeStore(store: Store) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2))
}

export function getSubmissions(filters?: {
  artisanId?: string
  brandId?: string
  status?: string
}): ProductSubmission[] {
  const store = readStore()
  let results = [...store.submissions]
  if (filters?.artisanId) results = results.filter((s) => s.artisanId === filters.artisanId)
  if (filters?.brandId) results = results.filter((s) => s.brandId === filters.brandId)
  if (filters?.status) results = results.filter((s) => s.status === filters.status)
  return results.sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  )
}

export function getSubmissionById(id: string): ProductSubmission | null {
  const store = readStore()
  return store.submissions.find((s) => s.id === id) ?? null
}

export function createSubmission(
  data: Omit<ProductSubmission, 'id' | 'status' | 'submittedAt' | 'updatedAt'>,
): ProductSubmission {
  const store = readStore()
  const now = new Date().toISOString()
  const submission: ProductSubmission = {
    ...data,
    id: randomUUID(),
    status: 'pending_audit',
    submittedAt: now,
    updatedAt: now,
  }
  store.submissions.unshift(submission)
  writeStore(store)
  return submission
}

export function updateSubmission(
  id: string,
  updates: Partial<ProductSubmission>,
): ProductSubmission | null {
  const store = readStore()
  const idx = store.submissions.findIndex((s) => s.id === id)
  if (idx === -1) return null
  store.submissions[idx] = {
    ...store.submissions[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  writeStore(store)
  return store.submissions[idx]
}

export function getPassports(filters?: { brandId?: string }): MaterialPassport[] {
  const store = readStore()
  let results = [...store.passports]
  if (filters?.brandId) results = results.filter((p) => p.brandId === filters.brandId)
  return results.sort(
    (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
  )
}

export function getPassportById(id: string): MaterialPassport | null {
  const store = readStore()
  return store.passports.find((p) => p.id === id) ?? null
}

export function getPassportBySubmissionId(submissionId: string): MaterialPassport | null {
  const store = readStore()
  return store.passports.find((p) => p.submissionId === submissionId) ?? null
}

export function createPassport(
  submission: ProductSubmission,
  auditorName: string,
  auditorOrg: string,
): MaterialPassport {
  const store = readStore()
  const existing = store.passports.find((p) => p.submissionId === submission.id)
  if (existing) return existing

  const auditDate = new Date().toISOString()
  const passport = createPassportFromSubmission(submission, auditorName, auditorOrg, auditDate)
  store.passports.unshift(passport)
  writeStore(store)
  return passport
}

export function createAuditRecord(
  data: Omit<AuditRecord, 'id' | 'auditedAt'>,
): AuditRecord {
  const store = readStore()
  const record: AuditRecord = {
    ...data,
    id: randomUUID(),
    auditedAt: new Date().toISOString(),
  }
  store.auditRecords.unshift(record)
  writeStore(store)
  return record
}

export function getAuditRecords(filters?: { submissionId?: string }): AuditRecord[] {
  const store = readStore()
  let results = [...store.auditRecords]
  if (filters?.submissionId) {
    results = results.filter((r) => r.submissionId === filters.submissionId)
  }
  return results.sort(
    (a, b) => new Date(b.auditedAt).getTime() - new Date(a.auditedAt).getTime(),
  )
}

export function saveUpload(id: string, dataUrl: string): string {
  const store = readStore()
  store.uploads[id] = dataUrl
  writeStore(store)
  return `/api/upload?id=${id}`
}

export function getUpload(id: string): string | null {
  const store = readStore()
  return store.uploads[id] ?? null
}

export { BRAND_ID, ARTISAN_ID }
