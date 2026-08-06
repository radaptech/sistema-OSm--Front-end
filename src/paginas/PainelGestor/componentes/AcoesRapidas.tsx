import { Gauge } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function AcoesRapidas() {
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
    </div>
  )
}
