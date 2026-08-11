import type { StatusSolicitacao } from '../../../tipos/ordemServico'

// Só os dois status que ficam parados esperando o Gestor. 'Convertida' não entra: assim
// que a OS é aberta, o acompanhamento passa para as abas de OS.
export type StatusFilaGestor = Extract<
  StatusSolicitacao,
  'Pendente' | 'Rejeitada'
>

const OPCOES: { valor: StatusFilaGestor; rotulo: string }[] = [
  { valor: 'Pendente', rotulo: 'Pendentes' },
  { valor: 'Rejeitada', rotulo: 'Rejeitadas' },
]

interface FiltroStatusSolicitacaoProps {
  valor: StatusFilaGestor
  aoMudar: (valor: StatusFilaGestor) => void
  contagens: Record<StatusFilaGestor, number>
}

export function FiltroStatusSolicitacao({
  valor,
  aoMudar,
  contagens,
}: FiltroStatusSolicitacaoProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPCOES.map((opcao) => {
        const ativo = opcao.valor === valor

        return (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => aoMudar(opcao.valor)}
            aria-pressed={ativo}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              ativo
                ? 'text-marca-800 shadow-card bg-white'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            {opcao.rotulo}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                ativo
                  ? 'bg-marca-100 text-marca-800'
                  : 'bg-white/10 text-slate-300'
              }`}
            >
              {contagens[opcao.valor]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
