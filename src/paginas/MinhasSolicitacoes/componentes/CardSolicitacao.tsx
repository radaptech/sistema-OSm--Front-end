import { BadgeStatus } from '../../../componentes/BadgeStatus'
import { formatarDataHora } from '../../../utilitarios/formatarData'
import type { SolicitacaoOS } from '../../../tipos/ordemServico'

interface CardSolicitacaoProps {
  solicitacao: SolicitacaoOS
}

export function CardSolicitacao({ solicitacao }: CardSolicitacaoProps) {
  return (
    <div className="shadow-card flex flex-col gap-3 rounded-xl bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex flex-1 items-start gap-4">
          <span className="from-marca-900 to-marca-500 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r font-mono text-sm font-bold text-white">
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
            <p className="mt-1 text-sm text-slate-500">
              {solicitacao.descricao}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 sm:block sm:shrink-0 sm:text-right">
          <p className="font-mono">{formatarDataHora(solicitacao.criadoEm)}</p>
          <p>
            Por:{' '}
            <span className="font-medium text-slate-500">
              {solicitacao.solicitanteNome}
            </span>
          </p>
        </div>
      </div>

      {/* Sem o motivo à vista, o Solicitante reabre o mesmo pedido com o mesmo defeito. */}
      {solicitacao.status === 'Rejeitada' && solicitacao.motivoRejeicao && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          <span className="font-semibold">Motivo da rejeição:</span>{' '}
          {solicitacao.motivoRejeicao}
        </p>
      )}
    </div>
  )
}
