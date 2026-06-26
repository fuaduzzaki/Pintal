import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ArtisanHeader } from '@/components/artisan/artisan-header'
import { SubmissionForm } from '@/components/artisan/submission-form'

export default function ArtisanSubmitPage() {
  return (
    <div className="min-h-screen bg-background">
      <ArtisanHeader />
      <main className="px-4 py-6 md:px-6">
        <Link href="/artisan" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </Link>
        <SubmissionForm />
      </main>
    </div>
  )
}
