'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AuditStatus } from '@/lib/dashboard-data'

interface DashboardContextValue {
  statusFilter: AuditStatus | 'all'
  setStatusFilter: (filter: AuditStatus | 'all') => void
  scrollToTable: () => void
  registerTableRef: (ref: HTMLDivElement | null) => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [statusFilter, setStatusFilter] = useState<AuditStatus | 'all'>('all')
  const [tableRef, setTableRef] = useState<HTMLDivElement | null>(null)

  return (
    <DashboardContext.Provider
      value={{
        statusFilter,
        setStatusFilter,
        scrollToTable: () => tableRef?.scrollIntoView({ behavior: 'smooth' }),
        registerTableRef: setTableRef,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) {
    return {
      statusFilter: 'all' as const,
      setStatusFilter: () => {},
      scrollToTable: () => {},
      registerTableRef: () => {},
    }
  }
  return ctx
}
