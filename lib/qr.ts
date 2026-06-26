import QRCode from 'qrcode'

export async function generatePassportQR(passportId: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const url = `${baseUrl}/passport/${passportId}`
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: {
      dark: '#3B2A1E',
      light: '#FAFAF8',
    },
  })
  return qrDataUrl
}

export function getPassportUrl(passportId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return `${baseUrl}/passport/${passportId}`
}
