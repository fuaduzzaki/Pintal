import { ArtisanHeader } from '@/components/artisan/artisan-header'
import { ArtisanSummaryCards, SubmissionHistory } from '@/components/artisan/submission-history'

export default function ArtisanDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <ArtisanHeader />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">Dashboard Pengrajin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Kelola submission material passport produk Anda</p>
        </div>
        <ArtisanSummaryCards />
        <SubmissionHistory />
      </main>
    </div>
  )
}
