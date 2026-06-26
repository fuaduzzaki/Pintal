import { cn } from '@/lib/utils'

export function PintalMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 52 64"
      fill="none"
      className={className}
      role="img"
      aria-label="Pintal"
    >
      {/* P monoline — angular bowl, flat-cut stem bottom */}
      <path
        d="M9 60 L9 15 Q9 7 17 7 L36 7 Q45 7 45 16 L45 31 Q45 40 36 40 L20 40"
        stroke="var(--color-text)"
        strokeWidth="7.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* flat-cut bottom of vertical stem */}
      <rect x="5.25" y="56" width="7.5" height="4" fill="var(--color-text)" />
      {/* honey gold verification badge inside the bowl */}
      <rect
        x="27"
        y="19"
        width="10"
        height="10"
        rx="1.5"
        fill="var(--color-gold)"
      />
    </svg>
  )
}

export function PintalLogo({
  className,
  markClassName,
  textClassName,
  showTagline = false,
}: {
  className?: string
  markClassName?: string
  textClassName?: string
  showTagline?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <PintalMark className={cn('h-8 w-auto', markClassName)} />
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            'font-serif text-2xl font-bold tracking-tight text-foreground',
            textClassName,
          )}
        >
          Pintal
          <span className="text-gold">.</span>
        </span>
        {showTagline && (
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Data <span className="text-gold">·</span> Trust{' '}
            <span className="text-gold">·</span> Flow
          </span>
        )}
      </div>
    </div>
  )
}
