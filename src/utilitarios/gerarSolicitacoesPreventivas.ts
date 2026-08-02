import type { PreventivaListada } from '../tipos/maquina'
import type { SolicitacaoOS } from '../tipos/ordemServico'

// Ids sintéticos das solicitações geradas automaticamente, fora da faixa dos ids mockados manuais.
const ID_BASE_PREVENTIVA = 900000

export function preventivaEstaVencida(
  proximaData: string,
  dataReferencia: Date,
): boolean {
  const dataVencimento = new Date(`${proximaData}T00:00:00`)
  return dataVencimento.getTime() <= dataReferencia.getTime()
}

// Simula, no front-end, o job que em produção rodaria no back-end: ao chegar (ou passar)
// a data de uma preventiva ativa, abre automaticamente uma solicitação de OS para o
// Gestor aprovar — sem duplicar quando já existir uma solicitação dessa preventiva.
export function gerarSolicitacoesPreventivasVencidas(
  preventivas: PreventivaListada[],
  solicitacoesExistentes: SolicitacaoOS[],
  dataReferencia: Date = new Date(),
): SolicitacaoOS[] {
  const preventivasJaSolicitadas = new Set(
    solicitacoesExistentes
      .filter((solicitacao) => solicitacao.origem === 'preventiva')
      .map((solicitacao) => solicitacao.preventivaId),
  )

  return preventivas
    .filter((preventiva) => preventiva.ativa)
    .filter((preventiva) =>
      preventivaEstaVencida(preventiva.proximaData, dataReferencia),
    )
    .filter((preventiva) => !preventivasJaSolicitadas.has(preventiva.id))
    .map((preventiva, indice) => ({
      id: ID_BASE_PREVENTIVA + indice,
      maquinaNome: preventiva.maquinaNome,
      maquinaCodigo: preventiva.maquinaId,
      status: 'Pendente',
      descricao: `Manutenção preventiva agendada: ${preventiva.descricao}`,
      solicitante: 'Sistema (Preventiva)',
      criadoEm: `${preventiva.proximaData}T08:00:00`,
      setor: preventiva.setor,
      lojaId: preventiva.lojaId,
      impactos: [],
      origem: 'preventiva',
      preventivaId: preventiva.id,
    }))
}
