import { ShieldCheck, User, Wrench, type LucideIcon } from 'lucide-react'
import type { PerfilLogin } from '../../../tipos/autenticacao'

interface OpcaoPerfil {
  valor: PerfilLogin
  rotulo: string
  Icone: LucideIcon
}

const OPCOES_PERFIL: OpcaoPerfil[] = [
  { valor: 'solicitante', rotulo: 'Solicitante', Icone: User },
  { valor: 'tecnico', rotulo: 'Técnico', Icone: Wrench },
  { valor: 'gestor', rotulo: 'Gestor', Icone: ShieldCheck },
]

interface SeletorPerfilProps {
  perfilSelecionado: PerfilLogin
  aoSelecionar: (perfil: PerfilLogin) => void
}

export function SeletorPerfil({
  perfilSelecionado,
  aoSelecionar,
}: SeletorPerfilProps) {
  return (
    <div className="flex gap-1 rounded-full bg-lime-100 p-1">
      {OPCOES_PERFIL.map(({ valor, rotulo, Icone }) => {
        const ativo = perfilSelecionado === valor

        return (
          <button
            key={valor}
            type="button"
            onClick={() => aoSelecionar(valor)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm transition ${
              ativo
                ? 'bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] font-semibold text-white shadow'
                : 'font-medium text-[#4bae70] hover:text-[#1f4e2c]'
            }`}
          >
            <Icone size={16} />
            {rotulo}
          </button>
        )
      })}
    </div>
  )
}
