export type UserRole = 'brand' | 'artisan' | 'lsm_auditor'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  organizationName: string
  city: string
  phone?: string
  createdAt: Date
}

export interface ProductSubmission {
  id: string
  artisanId: string
  artisanName: string
  brandId: string
  productName: string
  productType: 'Tenun' | 'Batik' | 'Lurik' | 'Songket' | 'Jumputan' | 'Lainnya'
  materialOrigin: string
  fiberType: string
  dyeMethod: string
  productionProcess: string
  photos: string[]
  geoLocation?: {
    lat: number
    lng: number
    address: string
  }
  status: SubmissionStatus
  submittedAt: string
  updatedAt: string
}

export type SubmissionStatus =
  | 'draft'
  | 'pending_audit'
  | 'in_review'
  | 'rejected'
  | 'approved'

export interface AuditRecord {
  id: string
  submissionId: string
  auditorId: string
  auditorName: string
  auditorOrganization: string
  decision: 'approved' | 'rejected'
  notes: string
  rejectionReason?: string
  auditedAt: string
}

export interface MaterialPassport {
  id: string
  submissionId: string
  brandId: string
  qrCodeUrl: string
  passportData: {
    productName: string
    productType: string
    artisanName: string
    artisanLocation: string
    materialOrigin: string
    fiberType: string
    dyeMethod: string
    productionProcess: string
    photos: string[]
    auditedBy: string
    auditorOrganization: string
    auditDate: string
    csrdCompliant: boolean
    epCompliant: boolean
  }
  status: 'active' | 'expired' | 'revoked'
  generatedAt: string
  expiresAt: string
}

export interface CSRDReport {
  id: string
  brandId: string
  brandName: string
  period: string
  totalProducts: number
  verifiedProducts: number
  passports: MaterialPassport[]
  generatedAt: string
  reportUrl?: string
}

export interface DemoUser extends User {
  password: string
}
