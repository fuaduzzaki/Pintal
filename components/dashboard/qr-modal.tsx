'use client'

import { useRef } from 'react'
import { Download, Printer } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { QrDisplay } from '@/components/passport/qr-display'
import { getPassportUrl } from '@/lib/qr'

interface QrModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  passportId: string
  productName: string
}

export function QrModal({ open, onOpenChange, passportId, productName }: QrModalProps) {
  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const link = document.createElement('a')
      link.download = `QR_${productName.replace(/\s+/g, '_')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`
  }

  const handlePrint = () => {
    const url = getPassportUrl(passportId)
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <html><head><title>QR ${productName}</title></head>
      <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif">
        <h2>${productName}</h2>
        <p style="font-size:12px;color:#666">${url}</p>
        <p style="font-size:12px;color:#666">Scan untuk verifikasi passport</p>
      </body></html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code Passport</DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>
        <div ref={qrRef} className="flex justify-center py-4">
          <QrDisplay passportId={passportId} size={220} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 rounded-full" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download QR
          </Button>
          <Button variant="outline" className="flex-1 rounded-full" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
