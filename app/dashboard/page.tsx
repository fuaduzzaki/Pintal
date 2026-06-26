import Link from 'next/link'
import { Plus, Download, LayoutDashboard } from 'lucide-react'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { ProductTable } from '@/components/dashboard/product-table'
import { AuditStatus } from '@/components/dashboard/audit-status'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="px-5 py-8 md:px-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Selamat datang kembali,{' '}
              <span className="font-semibold text-foreground">Sanggar Wastra</span>
            </p>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Material Passport
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola dan pantau status kepatuhan ekspor brand Anda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-border bg-transparent text-sm font-medium text-foreground hover:bg-surface"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
          <Link
            href="/dashboard/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Produk
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mt-8">
        <SummaryCards />
      </div>

      {/* Main content grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductTable />
        </div>
        <div>
          <AuditStatus />
        </div>
      </div>
    </div>
  )
}
