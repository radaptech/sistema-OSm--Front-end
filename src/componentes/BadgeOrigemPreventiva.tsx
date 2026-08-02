import { CalendarClock } from 'lucide-react'

export function BadgeOrigemPreventiva() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-white shadow-sm">
      <CalendarClock size={12} />
      Preventiva
    </span>
  )
}
