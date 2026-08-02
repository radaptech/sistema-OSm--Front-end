import { CalendarClock } from 'lucide-react'
import { formatarData } from '../../../utilitarios/formatarData'
import type { PreventivaListada } from '../../../tipos/maquina'

interface CardPreventivaProps {
  preventiva: PreventivaListada
}

export function CardPreventiva({ preventiva }: CardPreventivaProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] text-white">
          <CalendarClock size={16} />
        </span>
        <div>
          <p className="font-semibold text-slate-800">{preventiva.maquinaNome}</p>
          <p className="mt-0.5 text-sm text-slate-500">{preventiva.descricao}</p>
          <p className="mt-1 text-xs text-slate-400">
            A cada {preventiva.intervaloDias} dia(s) · Próxima:{' '}
            {formatarData(preventiva.proximaData)}
          </p>
        </div>
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ${
          preventiva.ativa
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-slate-200 text-slate-500'
        }`}
      >
        {preventiva.ativa ? 'Ativa' : 'Inativa'}
      </span>
    </div>
  )
}
