import { createPortal } from 'react-dom'
import { XCircle } from 'lucide-react'
import { Botao } from '../../../componentes/Botao'
import { BadgeStatusExecucao } from '../../../componentes/BadgeStatusExecucao'
import { calcularHoras } from '../../../utilitarios/calcularHoras'
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
  const horasParada = ordemServico.dataFim
    ? calcularHoras(ordemServico.dataAbertura, ordemServico.dataFim)
    : undefined

  return createPortal(
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-pop-in w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-pop">
        <div className="flex items-start justify-between bg-gradient-to-r from-marca-900 to-marca-500 px-6 py-4">
          <div>
            <p className="font-mono text-xs font-bold tracking-widest text-white/80 uppercase">
              Painel do Técnico
            </p>
            <p className="font-display text-lg font-bold text-white">
              OS #{ordemServico.id} · Encerrada
            </p>
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
              <p className="font-display font-semibold text-slate-800">
                {ordemServico.maquinaNome}
              </p>
              <p className="font-mono text-sm text-slate-400">{ordemServico.maquinaCodigo}</p>
            </div>
            <BadgeStatusExecucao status={ordemServico.statusExecucao} />
          </div>

          {/* Cada par de rótulos fica na própria grade (em vez de um único bloco com 6
              divs empilhando rótulo+valor cada um por conta própria): assim, se um
              rótulo quebra em duas linhas e o vizinho não (ex: "Horas Trabalhadas" vs
              "Horas Parada"), os dois valores abaixo continuam alinhados na mesma
              altura. */}
          <div className="flex flex-col gap-3 text-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Início
              </span>
              <span className="font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Término
              </span>
              <p className="font-mono text-slate-700">
                {ordemServico.dataInicio ? formatarDataHora(ordemServico.dataInicio) : '—'}
              </p>
              <p className="font-mono text-slate-700">
                {ordemServico.dataFim ? formatarDataHora(ordemServico.dataFim) : '—'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Horas Trabalhadas
              </span>
              <span className="font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Horas Parada
              </span>
              <p className="font-mono text-slate-700">
                {ordemServico.horasTrabalhadas !== undefined
                  ? `${ordemServico.horasTrabalhadas}h`
                  : '—'}
              </p>
              <p className="font-mono text-slate-700">
                {horasParada !== undefined ? `${horasParada}h` : '—'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Custo Hora do Técnico
              </span>
              <span className="font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Custo Manutenção
              </span>
              <p className="font-mono text-slate-700">
                {ordemServico.custo?.custoHoraTecnico != null
                  ? formatarMoeda(ordemServico.custo!.custoHoraTecnico!)
                  : '—'}
              </p>
              <p className="font-mono text-slate-700">
                {ordemServico.custo != null ? (
                  formatarMoeda(ordemServico.custo!.custoManutencao)
                ) : (
                  <span className="text-amber-600">Pendente de lançamento</span>
                )}
              </p>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Defeito Constatado
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {ordemServico.encerramento?.defeitoConstatado ?? '—'}
            </p>
          </div>

          <div>
            <p className="font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Causa Raiz
            </p>
            <p className="mt-1 text-sm text-slate-600">{ordemServico.encerramento?.causaRaiz ?? '—'}</p>
          </div>

          <div>
            <p className="font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Solução Aplicada
            </p>
            <p className="mt-1 text-sm text-slate-600">{ordemServico.encerramento?.solucao ?? '—'}</p>
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
