import { atrasoSimulado } from './atrasoSimulado'
import { ORDENS_SERVICO_MOCK } from './dadosMockOrdensServico'
import { calcularHoras } from '../utilitarios/calcularHoras'
import type {
  EncerramentoOrdemServicoPayload,
  LancamentoCustoManutencaoPayload,
} from '../tipos/ordemServico'

export interface ParametrosListagemOrdensServico {
  tecnicoId: string
}

function listarPorTecnico({ tecnicoId }: ParametrosListagemOrdensServico) {
  const ordens = ORDENS_SERVICO_MOCK.filter((ordem) => ordem.tecnicoId === tecnicoId)

  return atrasoSimulado(ordens)
}

function listarTodas() {
  return atrasoSimulado(ORDENS_SERVICO_MOCK)
}

function iniciar(id: number) {
  const ordem = ORDENS_SERVICO_MOCK.find((item) => item.id === id)

  if (ordem) {
    const agora = new Date().toISOString()
    ordem.statusExecucao = 'Em Andamento'
    ordem.dataInicio = ordem.dataInicio ?? agora
    ordem.sessaoAtualInicio = agora
  }

  return atrasoSimulado(ordem)
}

// Pausar só interrompe o relógio de horas do técnico — o tempo de máquina parada
// (dataAbertura → dataFim) segue contando corrido, sem depender do status da OS.
function pausar(id: number, motivoPausa: string) {
  const ordem = ORDENS_SERVICO_MOCK.find((item) => item.id === id)

  if (ordem) {
    if (ordem.sessaoAtualInicio) {
      const horasDaSessao = calcularHoras(ordem.sessaoAtualInicio, new Date().toISOString())
      ordem.horasTrabalhadasAcumuladas = (ordem.horasTrabalhadasAcumuladas ?? 0) + horasDaSessao
      ordem.sessaoAtualInicio = undefined
    }

    ordem.statusAntesDaPausa = ordem.statusExecucao === 'Em Andamento' ? 'Em Andamento' : 'Aberta'
    ordem.statusExecucao = 'Pausada'
    ordem.motivoPausa = motivoPausa
  }

  return atrasoSimulado(ordem)
}

function retomar(id: number) {
  const ordem = ORDENS_SERVICO_MOCK.find((item) => item.id === id)

  if (ordem) {
    const statusRetomado = ordem.statusAntesDaPausa ?? 'Em Andamento'
    ordem.statusExecucao = statusRetomado
    ordem.motivoPausa = undefined
    ordem.statusAntesDaPausa = undefined

    // Só reabre uma sessão de trabalho se o atendimento já havia começado — se a OS
    // foi pausada antes de "Iniciar Atendimento", a sessão só nasce nesse momento.
    if (statusRetomado === 'Em Andamento') {
      ordem.sessaoAtualInicio = new Date().toISOString()
    }
  }

  return atrasoSimulado(ordem)
}

function encerrar(dados: EncerramentoOrdemServicoPayload) {
  const ordem = ORDENS_SERVICO_MOCK.find((item) => item.id === dados.ordemServicoId)

  if (ordem) {
    ordem.statusExecucao = 'Concluída'
    ordem.dataInicio = dados.dataInicio
    ordem.dataFim = dados.dataFim
    ordem.sessaoAtualInicio = undefined
    ordem.horasTrabalhadas = dados.horasTrabalhadas
    ordem.custoHoraTecnico = dados.custoHoraTecnico
    ordem.defeitoConstatado = dados.defeitoConstatado
    ordem.causaRaiz = dados.causaRaiz
    ordem.solucao = dados.solucao
  }

  return atrasoSimulado(ordem)
}

// Lançado pelo Administrador (não pelo Técnico) após conferir a nota fiscal —
// ver regra de negócio no item 11 do CLAUDE.md.
function lancarCustoManutencao(dados: LancamentoCustoManutencaoPayload) {
  const ordem = ORDENS_SERVICO_MOCK.find((item) => item.id === dados.ordemServicoId)

  if (ordem) {
    ordem.custoManutencao = dados.custoManutencao
  }

  return atrasoSimulado(ordem)
}

export const servicoOrdensServico = {
  listarPorTecnico,
  listarTodas,
  iniciar,
  pausar,
  retomar,
  encerrar,
  lancarCustoManutencao,
}
