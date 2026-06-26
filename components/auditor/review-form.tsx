'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface ReviewFormProps {
  submissionId: string
}

export function ReviewForm({ submissionId }: ReviewFormProps) {
  const router = useRouter()
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null)
  const [notes, setNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const canSubmit =
    decision &&
    notes.trim() &&
    (decision === 'approved' || rejectionReason.trim()) &&
    confirmed

  const handleSubmit = async () => {
    if (!canSubmit || !decision) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, notes, rejectionReason }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      if (decision === 'approved') {
        toast.success('Passport berhasil diterbitkan')
      } else {
        toast.success('Submission ditolak, pengrajin akan diberitahu')
      }
      router.push('/auditor')
    } catch {
      toast.error('Gagal mengirim keputusan')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-5">
      <h2 className="font-serif text-lg font-bold">Keputusan Audit</h2>

      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => setDecision('approved')}
          className={cn(
            'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
            decision === 'approved'
              ? 'border-teal bg-teal/5 ring-2 ring-teal/20'
              : 'border-border hover:border-teal/40',
          )}
        >
          <CheckCircle2 className={cn('h-5 w-5 shrink-0', decision === 'approved' ? 'text-teal' : 'text-muted-foreground')} />
          <div>
            <p className="font-semibold text-foreground">Setujui — Data memenuhi standar EU CSRD</p>
            <p className="text-xs text-muted-foreground mt-0.5">Passport digital akan diterbitkan otomatis</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setDecision('rejected')}
          className={cn(
            'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
            decision === 'rejected'
              ? 'border-destructive bg-destructive/5 ring-2 ring-destructive/20'
              : 'border-border hover:border-destructive/40',
          )}
        >
          <XCircle className={cn('h-5 w-5 shrink-0', decision === 'rejected' ? 'text-destructive' : 'text-muted-foreground')} />
          <div>
            <p className="font-semibold text-foreground">Tolak — Data tidak memenuhi standar</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pengrajin dapat mengedit dan submit ulang</p>
          </div>
        </button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Catatan Audit *</Label>
        <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tuliskan catatan verifikasi..." />
      </div>

      {decision === 'rejected' && (
        <div className="space-y-2">
          <Label htmlFor="rejection">Alasan Penolakan *</Label>
          <Textarea id="rejection" rows={3} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Jelaskan alasan penolakan..." />
        </div>
      )}

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 h-4 w-4 accent-primary" />
        <span className="text-sm text-muted-foreground">
          Saya menyatakan telah memverifikasi data secara independen
        </span>
      </label>

      <Button className="w-full rounded-full" disabled={!canSubmit || submitting} onClick={handleSubmit}>
        {submitting ? 'Mengirim...' : 'Kirim Keputusan'}
      </Button>
    </div>
  )
}
