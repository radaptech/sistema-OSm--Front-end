import { createPortal } from 'react-dom'
import { XCircle } from 'lucide-react'
import { Botao } from '../../../componentes/Botao'
import { BadgeStatusExecucao } from '../../../componentes/BadgeStatusExecucao'
import { formatarDataHora } from '../../../utilitarios/formatarData'
import { formatarMoeda } from '../../../utilitarios/formatarMoeda'
import type { OrdemServico } from '../../../tipos/ordemServico'

interface ModalDetalhesEncerramentoProps {
  ordemServico: OrdemServico
  aoFechar: () => void
}

export function ModalDetalhesEncerramento({
  ordemServico,
  aoFechar,
}: ModalDetalhesEncerramentoProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-6 py-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-white/80 uppercase">
              Painel do Técnico
            </p>
            <p className="text-lg font-bold text-white">OS #{ordemServico.id} · Encerrada</p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={aoFechar}
            className="text-white/90 transition hover:text-white"
          >
            <XCircle size={22} />
          </button>
        </div>

        <div className="flex max-h-[75vh] flex-col gap-4 overflow-y-auto p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-800">{ordemServico.maquinaNome}</p>
              <p className="text-sm text-slate-400">{ordemServico.maquinaCodigo}</p>
            </div>
            <BadgeStatusExecucao status={ordemServico.statusExecucao} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Início
              </p>
              <p className="text-slate-700">
                {ordemServico.dataInicio ? formatarDataHora(ordemServico.dataInicio) : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Término
              </p>
              <p className="text-slate-700">
                {ordemServico.dataFim ? formatarDataHora(ordemServico.dataFim) : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Horas Trabalhadas
              </p>
              <p className="text-slate-700">
                {ordemServico.horaEstimada !== undefined
                  ? `${ordemServico.horaEstimada}h`
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Custo Total
              </p>
              <p className="text-slate-700">
                {ordemServico.custo !== undefined ? formatarMoeda(ordemServico.custo) : '—'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Defeito Constatado
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {ordemServico.defeitoConstatado ?? '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Causa Raiz
            </p>
            <p className="mt-1 text-sm text-slate-600">{ordemServico.causaRaiz ?? '—'}</p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Solução Aplicada
            </p>
            <p className="mt-1 text-sm text-slate-600">{ordemServico.solucao ?? '—'}</p>
          </div>

          <Botao type="button" variante="secundario" onClick={aoFechar}>
            Fechar
          </Botao>
        </div>
      </div>
    </div>,
    document.body,
  )
}
