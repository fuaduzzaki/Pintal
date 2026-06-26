'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { generateCSRDReport } from '@/lib/generate-report'
import type { MaterialPassport } from '@/lib/types'

const PERIODS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026']

interface CsrdReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CsrdReportModal({ open, onOpenChange }: CsrdReportModalProps) {
  const { data: session } = useSession()
  const [period, setPeriod] = useState('Q2 2026')
  const [passports, setPassports] = useState<MaterialPassport[]>([])
  const [loading, setLoading] = useState(false)

  const loadPreview = async () => {
    setLoading(true)
    const res = await fetch('/api/passports')
    const data = await res.json()
    setPassports(data)
    setLoading(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (next) loadPreview()
    onOpenChange(next)
  }

  const handleDownload = () => {
    if (!session?.user) return
    generateCSRDReport(
      {
        organizationName: session.user.organizationName,
        name: session.user.name,
      },
      passports,
      period,
    )
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gold" />
            Generate Laporan CSRD
          </DialogTitle>
          <DialogDescription>
            Unduh laporan kepatuhan EU CSRD untuk brand Anda
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Periode</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 text-sm">
            {loading ? (
              <p className="text-muted-foreground">Memuat preview...</p>
            ) : (
              <>
                <p><strong>{passports.length}</strong> produk terverifikasi</p>
                <p className="text-muted-foreground mt-1">Brand: {session?.user?.organizationName}</p>
              </>
            )}
          </div>

          <Button className="w-full rounded-full" onClick={handleDownload} disabled={loading || passports.length === 0}>
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
