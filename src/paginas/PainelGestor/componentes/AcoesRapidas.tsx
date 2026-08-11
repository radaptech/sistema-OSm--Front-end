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
        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-marca-800 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:brightness-95"
      >
        <Gauge size={16} />
        Indicadores
      </button>

      <button
        type="button"
        onClick={aoAbrirFiltros}
        className="relative flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-marca-800 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:brightness-95"
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
