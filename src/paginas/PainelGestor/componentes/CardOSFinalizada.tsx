import { Eye, Printer } from 'lucide-react'
import { BadgeTipoOS } from '../../../componentes/BadgeTipoOS'
import { formatarDataHora } from '../../../utilitarios/formatarData'
import { formatarMoeda } from '../../../utilitarios/formatarMoeda'
import type { OrdemServico } from '../../../tipos/ordemServico'

interface CardOSFinalizadaProps {
  ordemServico: OrdemServico
  aoVisualizar: (ordemServico: OrdemServico) => void
  aoImprimir: (ordemServico: OrdemServico) => void
}

export function CardOSFinalizada({
  ordemServico,
  aoVisualizar,
  aoImprimir,
}: CardOSFinalizadaProps) {
  const custoTotal =
    (ordemServico.custoHoraTecnico ?? 0) + (ordemServico.custoManutencao ?? 0)

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] text-sm font-bold text-white">
            #{ordemServico.id}
          </span>
          <span className="truncate font-semibold text-slate-800">
            {ordemServico.maquinaNome}
          </span>
          <span className="text-sm text-slate-400">· {ordemServico.maquinaCodigo}</span>
          <BadgeTipoOS tipo={ordemServico.tipo} />
        </div>
        <p className="mt-1 truncate text-xs text-slate-400">
          Encerrada em {ordemServico.dataFim ? formatarDataHora(ordemServico.dataFim) : '—'}
        </p>
        <p className="mt-1 text-xs font-semibold text-emerald-700">
          Custo Total: {formatarMoeda(custoTotal)}
        </p>
      </div>

      <div className="flex gap-2 sm:shrink-0">
        <button
          type="button"
          onClick={() => aoVisualizar(ordemServico)}
          aria-label="Visualizar OS"
          className="flex items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-slate-600 shadow-sm transition hover:bg-slate-200"
        >
          <Eye size={16} />
        </button>
        <button
          type="button"
          onClick={() => aoImprimir(ordemServico)}
          aria-label="Imprimir OS"
          className="flex items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-slate-600 shadow-sm transition hover:bg-slate-200"
        >
          <Printer size={16} />
        </button>
      </div>
    </div>
  )
}
