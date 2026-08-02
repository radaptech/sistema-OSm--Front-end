import { Gauge, Store, Tag, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function AcoesRapidas() {
  const navegar = useNavigate()

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => navegar('/cadastrar-usuario')}
        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#1f4e2c] shadow-sm transition hover:brightness-95"
      >
        <UserPlus size={16} />
        Cadastrar Usuário
      </button>

      <button
        type="button"
        onClick={() => navegar('/cadastrar-loja')}
        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#1f4e2c] shadow-sm transition hover:brightness-95"
      >
        <Store size={16} />
        Cadastrar Loja
      </button>

      <button
        type="button"
        onClick={() => navegar('/cadastrar-setor')}
        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#1f4e2c] shadow-sm transition hover:brightness-95"
      >
        <Tag size={16} />
        Cadastrar Setor
      </button>

      <button
        type="button"
        onClick={() => navegar('/dashboard-gestor')}
        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#1f4e2c] shadow-sm transition hover:brightness-95"
      >
        <Gauge size={16} />
        Indicadores
      </button>
    </div>
  )
}
