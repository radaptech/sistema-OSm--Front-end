import { Eye, Wrench } from 'lucide-react'
import { BadgeOrigemPreventiva } from '../../../componentes/BadgeOrigemPreventiva'
import { BadgeStatus } from '../../../componentes/BadgeStatus'
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
      className={`flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4 ${
        ehPreventiva ? 'border-l-4 border-amber-400 bg-amber-50/60' : ''
      }`}
    >
      <div className="flex flex-1 items-start gap-4">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${
            ehPreventiva
              ? 'bg-gradient-to-r from-amber-400 to-amber-500'
              : 'bg-gradient-to-r from-[#1f4e2c] to-[#4bae70]'
          }`}
        >
          #{solicitacao.id}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-800">
              {solicitacao.maquinaNome}
            </span>
            <span className="text-sm text-slate-400">
              · {solicitacao.maquinaCodigo}
            </span>
            <BadgeStatus status={solicitacao.status} />
            {ehPreventiva && <BadgeOrigemPreventiva />}
          </div>
          <p className="mt-1 text-sm text-slate-500">{solicitacao.descricao}</p>
          <p className="mt-1 text-xs text-slate-400">
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
              className="flex items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-slate-600 shadow-sm transition hover:bg-slate-200"
            >
              <Eye size={16} />
            </button>
          )}

          {aoAbrirOS && (
            <button
              type="button"
              onClick={() => aoAbrirOS(solicitacao)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition hover:brightness-110"
            >
              <Wrench size={14} />
              Abrir OS
            </button>
          )}
        </div>
      )}
    </div>
  )
}
