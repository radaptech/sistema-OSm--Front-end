import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import type { StatusSolicitacao } from '../tipos/ordemServico'

interface BadgeStatusProps {
  status: StatusSolicitacao
}

const CONFIGURACAO_STATUS: Record<
  StatusSolicitacao,
  { estilo: string; Icone: typeof Clock }
> = {
  Pendente: { estilo: 'bg-amber-100 text-amber-700', Icone: Clock },
  Convertida: { estilo: 'bg-emerald-100 text-emerald-700', Icone: CheckCircle2 },
  Rejeitada: { estilo: 'bg-red-100 text-red-700', Icone: XCircle },
}

export function BadgeStatus({ status }: BadgeStatusProps) {
  const { estilo, Icone } = CONFIGURACAO_STATUS[status]

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${estilo}`}
    >
      <Icone size={12} />
      {status}
    </span>
  )
}
