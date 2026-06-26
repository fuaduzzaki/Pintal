'use client'

import QRCode from 'react-qr-code'
import { getPassportUrl } from '@/lib/qr'

interface QrDisplayProps {
  passportId: string
  size?: number
}

export function QrDisplay({ passportId, size = 200 }: QrDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-2xl border border-border bg-[#FAFAF8] p-4">
        <QRCode
          value={getPassportUrl(passportId)}
          size={size}
          fgColor="#3B2A1E"
          bgColor="#FAFAF8"
        />
      </div>
      <p className="max-w-xs truncate text-center font-mono text-xs text-muted-foreground">
        {getPassportUrl(passportId)}
      </p>
    </div>
  )
}
