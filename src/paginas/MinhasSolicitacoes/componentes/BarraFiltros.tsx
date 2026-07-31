import { Search } from 'lucide-react'
import { statusSolicitacao, type StatusSolicitacao } from '../../../tipos/ordemServico'

export type FiltroStatus = StatusSolicitacao | 'Todos'

const FILTROS: FiltroStatus[] = ['Todos', ...statusSolicitacao]

interface BarraFiltrosProps {
  busca: string
  aoMudarBusca: (valor: string) => void
  filtroSelecionado: FiltroStatus
  aoSelecionarFiltro: (filtro: FiltroStatus) => void
}

export function BarraFiltros({
  busca,
  aoMudarBusca,
  filtroSelecionado,
  aoSelecionarFiltro,
}: BarraFiltrosProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          size={18}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={busca}
          onChange={(evento) => aoMudarBusca(evento.target.value)}
          placeholder="Buscar por máquina ou descrição..."
          className="w-full rounded-lg bg-white py-2.5 pr-4 pl-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#4bae70]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTROS.map((filtro) => {
          const ativo = filtro === filtroSelecionado

          return (
            <button
              key={filtro}
              type="button"
              onClick={() => aoSelecionarFiltro(filtro)}
              className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
                ativo
                  ? 'bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] text-white'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {filtro}
            </button>
          )
        })}
      </div>
    </div>
  )
}
