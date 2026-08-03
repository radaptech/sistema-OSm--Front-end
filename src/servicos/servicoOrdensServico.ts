import { atrasoSimulado } from './atrasoSimulado'
import { ORDENS_SERVICO_MOCK } from './dadosMockOrdensServico'
import type { EncerramentoOrdemServicoPayload } from '../tipos/ordemServico'

export interface ParametrosListagemOrdensServico {
  tecnicoId: string
}

function listarPorTecnico({ tecnicoId }: ParametrosListagemOrdensServico) {
  const ordens = ORDENS_SERVICO_MOCK.filter((ordem) => ordem.tecnicoId === tecnicoId)

  return atrasoSimulado(ordens)
}

function iniciar(id: number) {
  const ordem = ORDENS_SERVICO_MOCK.find((item) => item.id === id)

  if (ordem) {
    ordem.statusExecucao = 'Em Andamento'
    ordem.dataInicio = ordem.dataInicio ?? new Date().toISOString()
  }

  return atrasoSimulado(ordem)
}

function pausar(id: number, motivoPausa: string) {
  const ordem = ORDENS_SERVICO_MOCK.find((item) => item.id === id)

  if (ordem) {
    ordem.statusAntesDaPausa = ordem.statusExecucao === 'Em Andamento' ? 'Em Andamento' : 'Aberta'
    ordem.statusExecucao = 'Pausada'
    ordem.motivoPausa = motivoPausa
  }

  return atrasoSimulado(ordem)
}

function retomar(id: number) {
  const ordem = ORDENS_SERVICO_MOCK.find((item) => item.id === id)

  if (ordem) {
    ordem.statusExecucao = ordem.statusAntesDaPausa ?? 'Em Andamento'
    ordem.motivoPausa = undefined
    ordem.statusAntesDaPausa = undefined
  }

  return atrasoSimulado(ordem)
}

function encerrar(dados: EncerramentoOrdemServicoPayload) {
  const ordem = ORDENS_SERVICO_MOCK.find((item) => item.id === dados.ordemServicoId)

  if (ordem) {
    ordem.statusExecucao = 'Concluída'
    ordem.dataInicio = dados.dataInicio
    ordem.dataFim = dados.dataFim
    ordem.horaEstimada = dados.horaEstimada
    ordem.custo = dados.custo
    ordem.defeitoConstatado = dados.defeitoConstatado
    ordem.causaRaiz = dados.causaRaiz
    ordem.solucao = dados.solucao
  }

  return atrasoSimulado(ordem)
}

export const servicoOrdensServico = {
  listarPorTecnico,
  iniciar,
  pausar,
  retomar,
  encerrar,
}
