import { CheckCircle2, Eye, Wrench } from 'lucide-react'
import { BadgeOrigemPreventiva } from '../../../componentes/BadgeOrigemPreventiva'
import { BadgeStatus } from '../../../componentes/BadgeStatus'
import { BadgeTipoOS } from '../../../componentes/BadgeTipoOS'
import { Botao } from '../../../componentes/Botao'
import { formatarDataHora } from '../../../utilitarios/formatarData'
import type { SolicitacaoOS } from '../../../tipos/ordemServico'

interface CardSolicitacaoGestorProps {
  solicitacao: SolicitacaoOS
  aoAbrirOS?: (solicitacao: SolicitacaoOS) => void
  aoVisualizar?: (solicitacao: SolicitacaoOS) => void
}

export function CardSolicitacaoGestor({
  solicitacao,
  aoAbrirOS,
  aoVisualizar,
}: CardSolicitacaoGestorProps) {
  const ehPreventiva = solicitacao.origem === 'preventiva'

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl bg-white p-4 shadow-card sm:flex-row sm:items-center sm:gap-4 ${
        ehPreventiva ? 'border-l-4 border-amber-400 bg-amber-50/60' : ''
      }`}
    >
      <div className="flex flex-1 items-start gap-4">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold text-white ${
            ehPreventiva
              ? 'bg-gradient-to-r from-amber-400 to-amber-500'
              : 'bg-gradient-to-r from-marca-900 to-marca-500'
          }`}
        >
          #{solicitacao.id}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-800">
              {solicitacao.maquinaNome}
            </span>
            <span className="font-mono text-sm text-slate-400">
              · {solicitacao.maquinaCodigo}
            </span>
            <BadgeStatus status={solicitacao.status} />
            <BadgeTipoOS tipo={solicitacao.tipo} />
            {ehPreventiva && <BadgeOrigemPreventiva />}
          </div>
          <p className="mt-1 text-sm text-slate-500">{solicitacao.descricao}</p>
          <p className="mt-1 font-mono text-xs text-slate-400">
            {formatarDataHora(solicitacao.criadoEm)} · Por{' '}
            <span className="font-medium text-slate-500">
              {solicitacao.solicitante}
            </span>
          </p>
        </div>
      </div>

      {(aoVisualizar || aoAbrirOS) && (
        <div className="flex gap-2 sm:shrink-0">
          {aoVisualizar && (
            <button
              type="button"
              onClick={() => aoVisualizar(solicitacao)}
              aria-label="Visualizar solicitação"
              className="flex items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-slate-600 shadow-card transition-all duration-200 hover:bg-slate-200"
            >
              <Eye size={16} />
            </button>
          )}

          {aoAbrirOS && (
            <div className="flex-1">
              <Botao
                type="button"
                onClick={() => aoAbrirOS(solicitacao)}
                className="flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {solicitacao.tipo === 'terceiros' ? (
                  <>
                    <CheckCircle2 size={14} />
                    Aprovar
                  </>
                ) : (
                  <>
                    <Wrench size={14} />
                    Abrir OS
                  </>
                )}
              </Botao>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
