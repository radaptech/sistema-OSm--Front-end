import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Printer, XCircle } from 'lucide-react'
import { Botao } from '../../componentes/Botao'
import { BadgeStatusExecucao } from '../../componentes/BadgeStatusExecucao'
import { BadgeTipoOS } from '../../componentes/BadgeTipoOS'
import { BadgeUrgencia } from '../../componentes/BadgeUrgencia'
import { LOJAS_MOCK } from '../../servicos/dadosMockLojas'
import { TECNICOS_MOCK } from '../../servicos/dadosMockTecnicos'
import { EMPRESAS_TERCEIRIZADAS_MOCK } from '../../servicos/dadosMockEmpresasTerceirizadas'
import { calcularHoras } from '../../utilitarios/calcularHoras'
import { formatarDataHora } from '../../utilitarios/formatarData'
import { formatarMoeda } from '../../utilitarios/formatarMoeda'
import type { OrdemServico } from '../../tipos/ordemServico'

interface ModalDetalhesOSProps {
  ordemServico: OrdemServico
  aoFechar: () => void
  autoImprimir?: boolean
  contexto?: string
}

export function ModalDetalhesOS({
  ordemServico,
  aoFechar,
  autoImprimir = false,
  contexto = 'Painel do Administrador',
}: ModalDetalhesOSProps) {
  const loja = LOJAS_MOCK.find((item) => item.id === ordemServico.lojaId)
  const tecnico = TECNICOS_MOCK.find((item) => item.id === ordemServico.tecnicoId)
  const empresaTerceirizada = EMPRESAS_TERCEIRIZADAS_MOCK.find(
    (item) => item.id === ordemServico.empresaTerceirizadaId,
  )
  const custoTotal = (ordemServico.custoHoraTecnico ?? 0) + (ordemServico.custoManutencao ?? 0)
  const horasParada = ordemServico.dataFim
    ? calcularHoras(ordemServico.dataAbertura, ordemServico.dataFim)
    : undefined

  useEffect(() => {
    if (!autoImprimir) {
      return
    }

    const temporizador = setTimeout(() => window.print(), 200)
    return () => clearTimeout(temporizador)
  }, [autoImprimir])

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-6 py-4 print:hidden">
          <div>
            <p className="text-xs font-bold tracking-widest text-white/80 uppercase">
              {contexto}
            </p>
            <p className="text-lg font-bold text-white">OS #{ordemServico.id} · Detalhes</p>
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

        <div id="area-impressao-os" className="flex max-h-[75vh] flex-col gap-4 overflow-y-auto p-6">
          <div className="hidden print:block">
            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              Solicitação OS
            </p>
            <p className="text-lg font-bold text-slate-800">Ordem de Serviço #{ordemServico.id}</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-800">{ordemServico.maquinaNome}</p>
              <p className="text-sm text-slate-400">{ordemServico.maquinaCodigo}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <BadgeStatusExecucao status={ordemServico.statusExecucao} />
              <BadgeTipoOS tipo={ordemServico.tipo} />
              {ordemServico.urgencia && <BadgeUrgencia urgencia={ordemServico.urgencia} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Loja</p>
              <p className="text-slate-700">{loja?.nome ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Setor</p>
              <p className="text-slate-700">{ordemServico.setor}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Solicitante
              </p>
              <p className="text-slate-700">{ordemServico.solicitante}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                {ordemServico.tipo === 'terceiros' ? 'Empresa Terceirizada' : 'Técnico Responsável'}
              </p>
              <p className="text-slate-700">
                {ordemServico.tipo === 'terceiros'
                  ? (empresaTerceirizada?.nome ?? '—')
                  : tecnico
                    ? `${tecnico.nome} — ${tecnico.area}`
                    : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Abertura da OS
              </p>
              <p className="text-slate-700">{formatarDataHora(ordemServico.dataAbertura)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Início / Término
              </p>
              <p className="text-slate-700">
                {ordemServico.dataInicio ? formatarDataHora(ordemServico.dataInicio) : '—'} até{' '}
                {ordemServico.dataFim ? formatarDataHora(ordemServico.dataFim) : '—'}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Custos
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Horas Trabalhadas</p>
                <p className="font-semibold text-slate-700">
                  {ordemServico.horasTrabalhadas !== undefined
                    ? `${ordemServico.horasTrabalhadas}h`
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Horas Parada</p>
                <p className="font-semibold text-slate-700">
                  {horasParada !== undefined ? `${horasParada}h` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Custo Hora Técnico</p>
                <p className="font-semibold text-slate-700">
                  {ordemServico.custoHoraTecnico !== undefined
                    ? formatarMoeda(ordemServico.custoHoraTecnico)
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Custo Manutenção</p>
                <p className="font-semibold text-slate-700">
                  {ordemServico.custoManutencao !== undefined
                    ? formatarMoeda(ordemServico.custoManutencao)
                    : '—'}
                </p>
              </div>
            </div>
            <div className="mt-3 border-t border-slate-200 pt-3">
              <p className="text-xs text-slate-400">Custo Total</p>
              <p className="text-lg font-bold text-[#1f4e2c]">{formatarMoeda(custoTotal)}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Defeito Constatado
            </p>
            <p className="mt-1 text-sm text-slate-600">{ordemServico.defeitoConstatado ?? '—'}</p>
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

          <div className="mt-1 flex gap-3 print:hidden">
            <div className="flex-1">
              <Botao type="button" variante="secundario" onClick={aoFechar}>
                Fechar
              </Botao>
            </div>
            <div className="flex-1">
              <Botao
                type="button"
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2"
              >
                <Printer size={16} />
                Imprimir
              </Botao>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
