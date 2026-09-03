import { Filter, Gauge } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AcoesRapidasProps {
  aoAbrirFiltros: () => void
  quantidadeFiltrosAtivos: number
}

export function AcoesRapidas({ aoAbrirFiltros, quantidadeFiltrosAtivos }: AcoesRapidasProps) {
  const navegar = useNavigate()

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => navegar('/dashboard-gestor')}
        className="flex h-[46px] items-center gap-2 rounded-xl border border-slate-200/60 bg-white px-5 text-sm font-bold text-slate-600 transition-colors duration-rapido hover:bg-slate-50 hover:text-slate-900"
      >
        <Gauge size={16} />
        Indicadores
      </button>

      <button
        type="button"
        onClick={aoAbrirFiltros}
        className="relative flex h-[46px] items-center gap-2 rounded-xl border border-slate-200/60 bg-white px-5 text-sm font-bold text-slate-600 transition-colors duration-rapido hover:bg-slate-50 hover:text-slate-900"
      >
        <Filter size={16} />
        Filtrar OS
        {quantidadeFiltrosAtivos > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-marca-500 px-1 font-mono text-[11px] font-bold text-white">
            {quantidadeFiltrosAtivos}
          </span>
        )}
      </button>
    </div>
  )
}
