import { AuditorHeader } from '@/components/auditor/auditor-header'
import { AuditorSummaryCards, PendingList } from '@/components/auditor/pending-list'

export default function AuditorDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <AuditorHeader />
      <main className="mx-auto max-w-6xl space-y-6 px-5 py-8 md:px-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard Auditor LSM</h1>
          <p className="mt-1 text-sm text-muted-foreground">Verifikasi submission material passport dari pengrajin</p>
        </div>
        <AuditorSummaryCards />
        <PendingList />
      </main>
    </div>
  )
}
