import { AlertTriangle } from 'lucide-react'
import type { IdUrgencia } from '../tipos/ordemServico'

interface BadgeUrgenciaProps {
  urgencia: IdUrgencia
}

const ESTILOS_URGENCIA: Record<IdUrgencia, string> = {
  Baixa: 'bg-emerald-100 text-emerald-700',
  Média: 'bg-amber-100 text-amber-700',
  Alta: 'bg-red-100 text-red-700',
}

export function BadgeUrgencia({ urgencia }: BadgeUrgenciaProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${ESTILOS_URGENCIA[urgencia]}`}
    >
      <AlertTriangle size={12} />
      {urgencia}
    </span>
  )
}
