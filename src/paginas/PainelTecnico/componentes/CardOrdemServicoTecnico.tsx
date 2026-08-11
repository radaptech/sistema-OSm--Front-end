import {
  CheckCircle2,
  Eye,
  FileSearch,
  PauseCircle,
  PlayCircle,
  Truck,
} from 'lucide-react'
import { BadgeAfetaProducao } from '../../../componentes/BadgeAfetaProducao'
import { BadgeStatusExecucao } from '../../../componentes/BadgeStatusExecucao'
import { BadgeUrgencia } from '../../../componentes/BadgeUrgencia'
import { formatarDataHora } from '../../../utilitarios/formatarData'
import type { OrdemServico } from '../../../tipos/ordemServico'

interface CardOrdemServicoTecnicoProps {
  ordemServico: OrdemServico
  aoIniciar?: (ordemServico: OrdemServico) => void
  aoPausar?: (ordemServico: OrdemServico) => void
  aoRetomar?: (ordemServico: OrdemServico) => void
  aoFinalizar?: (ordemServico: OrdemServico) => void
  aoVerDetalhes?: (ordemServico: OrdemServico) => void
  aoAcionarTerceiro?: (ordemServico: OrdemServico) => void
  aoVerSolicitacao?: (ordemServico: OrdemServico) => void
}

export function CardOrdemServicoTecnico({
  ordemServico,
  aoIniciar,
  aoPausar,
  aoRetomar,
  aoFinalizar,
  aoVerDetalhes,
  aoAcionarTerceiro,
  aoVerSolicitacao,
}: CardOrdemServicoTecnicoProps) {
  const botaoAcionarTerceiro = aoAcionarTerceiro && (
    <button
      type="button"
      onClick={() => aoAcionarTerceiro(ordemServico)}
      aria-label="Acionar empresa terceirizada"
      title={
        ordemServico.empresaTerceirizadaNome
          ? 'Trocar empresa terceirizada'
          : 'Acionar empresa terceirizada'
      }
      className="shadow-card hover:shadow-card-hover flex shrink-0 items-center justify-center rounded-xl bg-blue-50 px-3.5 py-2.5 text-blue-700 transition-all duration-200 hover:bg-blue-100 active:scale-95"
    >
      <Truck size={16} />
    </button>
  )

  const botaoVerSolicitacao = aoVerSolicitacao && (
    <button
      type="button"
      onClick={() => aoVerSolicitacao(ordemServico)}
      aria-label="Ver solicitação original"
      title="Ver solicitação original (com foto/vídeo do defeito)"
      className="shadow-card hover:shadow-card-hover flex shrink-0 items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-slate-600 transition-all duration-200 hover:bg-slate-200 active:scale-95"
    >
      <FileSearch size={16} />
    </button>
  )

  return (
    <div className="shadow-card hover:shadow-card-hover flex flex-col gap-3 rounded-xl bg-white p-4 transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <span className="from-marca-900 to-marca-500 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r font-mono text-sm font-bold text-white">
          #{ordemServico.id}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display font-semibold text-slate-800">
              {ordemServico.maquinaNome}
            </span>
            <span className="font-mono text-sm text-slate-400">
              · {ordemServico.maquinaCodigo}
            </span>
            <BadgeStatusExecucao status={ordemServico.statusExecucao} />
            {ordemServico.urgencia && (
              <BadgeUrgencia urgencia={ordemServico.urgencia} />
            )}
            {ordemServico.afetaProducao && <BadgeAfetaProducao />}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {ordemServico.descricao}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {ordemServico.lojaNome} · {ordemServico.setorNome}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Aberta em{' '}
            <span className="font-mono">
              {formatarDataHora(ordemServico.dataAbertura)}
            </span>{' '}
            · Solicitado por{' '}
            <span className="font-medium text-slate-500">
              {ordemServico.solicitanteNome}
            </span>
          </p>
        </div>

        {aoVerDetalhes && (
          <button
            type="button"
            onClick={() => aoVerDetalhes(ordemServico)}
            aria-label="Ver detalhes do encerramento"
            className="shadow-card hover:shadow-card-hover flex items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-slate-600 transition-all duration-200 hover:bg-slate-200 active:scale-95"
          >
            <Eye size={16} />
          </button>
        )}
      </div>

      {ordemServico.empresaTerceirizadaNome && (
        <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">
          <span className="font-semibold">Terceiro acionado:</span>{' '}
          {ordemServico.empresaTerceirizadaNome}
        </p>
      )}

      {ordemServico.statusExecucao === 'Pausada' &&
        ordemServico.pausaAtual?.motivo && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            <span className="font-semibold">Motivo da pausa:</span>{' '}
            {ordemServico.pausaAtual?.motivo}
          </p>
        )}

      {(ordemServico.statusExecucao === 'Aberta' ||
        ordemServico.statusExecucao === 'Em Andamento') && (
        <div className="flex gap-2">
          {botaoVerSolicitacao}
          {botaoAcionarTerceiro}

          {aoPausar && (
            <button
              type="button"
              onClick={() => aoPausar(ordemServico)}
              className="font-display shadow-card hover:shadow-card-hover flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-100 px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-amber-700 transition-all duration-200 hover:bg-amber-200 active:scale-[0.98]"
            >
              <PauseCircle size={14} />
              Pausar
            </button>
          )}

          {ordemServico.statusExecucao === 'Aberta' && aoIniciar && (
            <button
              type="button"
              onClick={() => aoIniciar(ordemServico)}
              className="from-marca-900 to-marca-500 font-display shadow-card hover:shadow-card-hover flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              <PlayCircle size={14} />
              Iniciar Atendimento
            </button>
          )}

          {ordemServico.statusExecucao === 'Em Andamento' && aoFinalizar && (
            <button
              type="button"
              onClick={() => aoFinalizar(ordemServico)}
              className="from-marca-900 to-marca-500 font-display shadow-card hover:shadow-card-hover flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              <CheckCircle2 size={14} />
              Finalizar OS
            </button>
          )}
        </div>
      )}

      {ordemServico.statusExecucao === 'Pausada' && aoRetomar && (
        <div className="flex gap-2">
          {botaoVerSolicitacao}
          {botaoAcionarTerceiro}

          <button
            type="button"
            onClick={() => aoRetomar(ordemServico)}
            className="from-marca-900 to-marca-500 font-display shadow-card hover:shadow-card-hover flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          >
            <PlayCircle size={14} />
            Retomar Atendimento
          </button>
        </div>
      )}
    </div>
  )
}
