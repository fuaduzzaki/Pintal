import jsPDF from 'jspdf'
import type { MaterialPassport } from './types'

interface BrandInfo {
  organizationName: string
  name: string
}

export function generateCSRDReport(
  brand: BrandInfo,
  passports: MaterialPassport[],
  period: string,
): void {
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.setTextColor('#3B2A1E')
  doc.text('Laporan Kepatuhan EU CSRD', 20, 20)
  doc.setFontSize(12)
  doc.text(`Periode: ${period}`, 20, 30)
  doc.text(`Brand: ${brand.organizationName}`, 20, 40)
  doc.text(`PIC: ${brand.name}`, 20, 48)

  doc.text(`Total produk terverifikasi: ${passports.length}`, 20, 65)
  doc.text('Diterbitkan oleh: Pintal Platform', 20, 73)
  doc.text(
    `Tanggal generate: ${new Date().toLocaleDateString('id-ID')}`,
    20,
    81,
  )

  doc.setFontSize(11)
  doc.text('Daftar Produk Terverifikasi:', 20, 95)

  let y = 105
  passports.forEach((passport, index) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.text(`${index + 1}. ${passport.passportData.productName}`, 20, y)
    doc.text(`   Pengrajin: ${passport.passportData.artisanName}`, 20, y + 7)
    doc.text(`   Auditor: ${passport.passportData.auditedBy}`, 20, y + 14)
    doc.text(
      `   Tanggal Audit: ${new Date(passport.passportData.auditDate).toLocaleDateString('id-ID')}`,
      20,
      y + 21,
    )
    y += 32
  })

  doc.save(`CSRD_Report_${brand.organizationName.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.pdf`)
}
