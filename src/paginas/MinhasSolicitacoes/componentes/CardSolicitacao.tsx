import { BadgeStatus } from '../../../componentes/BadgeStatus'
import { formatarDataHora } from '../../../utilitarios/formatarData'
import type { SolicitacaoOS } from '../../../tipos/ordemServico'

interface CardSolicitacaoProps {
  solicitacao: SolicitacaoOS
}

export function CardSolicitacao({ solicitacao }: CardSolicitacaoProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-card sm:flex-row sm:items-start sm:gap-4">
      <div className="flex flex-1 items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-marca-900 to-marca-500 font-mono text-sm font-bold text-white">
          #{solicitacao.id}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display font-semibold text-slate-800">
              {solicitacao.maquinaNome}
            </span>
            <span className="font-mono text-sm text-slate-400">
              · {solicitacao.maquinaCodigo}
            </span>
            <BadgeStatus status={solicitacao.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">{solicitacao.descricao}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 sm:block sm:shrink-0 sm:text-right">
        <p className="font-mono">{formatarDataHora(solicitacao.criadoEm)}</p>
        <p>
          Por: <span className="font-medium text-slate-500">{solicitacao.solicitante}</span>
        </p>
      </div>
    </div>
  )
}
