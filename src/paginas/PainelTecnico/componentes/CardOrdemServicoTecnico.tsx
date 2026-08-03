import { CheckCircle2, Eye, PauseCircle, PlayCircle } from 'lucide-react'
import { BadgeStatusExecucao } from '../../../componentes/BadgeStatusExecucao'
import { BadgeUrgencia } from '../../../componentes/BadgeUrgencia'
import { LOJAS_MOCK } from '../../../servicos/dadosMockLojas'
import { formatarDataHora } from '../../../utilitarios/formatarData'
import type { OrdemServico } from '../../../tipos/ordemServico'

interface CardOrdemServicoTecnicoProps {
  ordemServico: OrdemServico
  aoIniciar?: (ordemServico: OrdemServico) => void
  aoPausar?: (ordemServico: OrdemServico) => void
  aoRetomar?: (ordemServico: OrdemServico) => void
  aoFinalizar?: (ordemServico: OrdemServico) => void
  aoVerDetalhes?: (ordemServico: OrdemServico) => void
}

export function CardOrdemServicoTecnico({
  ordemServico,
  aoIniciar,
  aoPausar,
  aoRetomar,
  aoFinalizar,
  aoVerDetalhes,
}: CardOrdemServicoTecnicoProps) {
  const loja = LOJAS_MOCK.find((item) => item.id === ordemServico.lojaId)

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] text-sm font-bold text-white">
          #{ordemServico.id}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-800">
              {ordemServico.maquinaNome}
            </span>
            <span className="text-sm text-slate-400">
              · {ordemServico.maquinaCodigo}
            </span>
            <BadgeStatusExecucao status={ordemServico.statusExecucao} />
            <BadgeUrgencia urgencia={ordemServico.urgencia} />
          </div>
          <p className="mt-1 text-sm text-slate-500">{ordemServico.descricao}</p>
          <p className="mt-1 text-xs text-slate-400">
            {loja?.nome ?? '—'} · {ordemServico.setor}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Aberta em {formatarDataHora(ordemServico.dataAbertura)} · Solicitado por{' '}
            <span className="font-medium text-slate-500">{ordemServico.solicitante}</span>
          </p>
        </div>

        {aoVerDetalhes && (
          <button
            type="button"
            onClick={() => aoVerDetalhes(ordemServico)}
            aria-label="Ver detalhes do encerramento"
            className="flex items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-slate-600 shadow-sm transition hover:bg-slate-200"
          >
            <Eye size={16} />
          </button>
        )}
      </div>

      {ordemServico.statusExecucao === 'Pausada' && ordemServico.motivoPausa && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Motivo da pausa: {ordemServico.motivoPausa}
        </p>
      )}

      {(ordemServico.statusExecucao === 'Aberta' ||
        ordemServico.statusExecucao === 'Em Andamento') && (
        <div className="flex gap-2">
          {aoPausar && (
            <button
              type="button"
              onClick={() => aoPausar(ordemServico)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-100 px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-amber-700 shadow-sm transition hover:bg-amber-200"
            >
              <PauseCircle size={14} />
              Pausar
            </button>
          )}

          {ordemServico.statusExecucao === 'Aberta' && aoIniciar && (
            <button
              type="button"
              onClick={() => aoIniciar(ordemServico)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition hover:brightness-110"
            >
              <PlayCircle size={14} />
              Iniciar Atendimento
            </button>
          )}

          {ordemServico.statusExecucao === 'Em Andamento' && aoFinalizar && (
            <button
              type="button"
              onClick={() => aoFinalizar(ordemServico)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition hover:brightness-110"
            >
              <CheckCircle2 size={14} />
              Finalizar OS
            </button>
          )}
        </div>
      )}

      {ordemServico.statusExecucao === 'Pausada' && aoRetomar && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => aoRetomar(ordemServico)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition hover:brightness-110"
          >
            <PlayCircle size={14} />
            Retomar Atendimento
          </button>
        </div>
      )}
    </div>
  )
}
