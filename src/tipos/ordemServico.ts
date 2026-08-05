import type { Setor } from './maquina'

export const tiposOS = ['maquinario', 'terceiros', 'reparo'] as const

export type TipoOS = (typeof tiposOS)[number]

export const tiposDefeito = [
  'Mecânico',
  'Elétrico',
  'Hidráulico',
  'Pneumático',
  'Software / CNC',
  'Estrutural',
] as const

export type TipoDefeito = (typeof tiposDefeito)[number]

export const marcadoresImpacto = [
  'Afeta Produção',
  'Parada Parcial',
  'Retrabalho',
] as const

export type MarcadorImpacto = (typeof marcadoresImpacto)[number]

export interface NovaSolicitacaoOSPayload {
  maquinaId: string
  tipoDefeito: TipoDefeito
  descricao: string
  setor: string
  lojaId: string
  solicitante: string
  impactos: MarcadorImpacto[]
  dataHora: string
}

export const statusSolicitacao = [
  'Pendente',
  'Convertida',
  'Rejeitada',
] as const

export type StatusSolicitacao = (typeof statusSolicitacao)[number]

export const origensSolicitacao = ['solicitante', 'preventiva'] as const

export type OrigemSolicitacao = (typeof origensSolicitacao)[number]

export interface SolicitacaoOS {
  id: number
  tipo: TipoOS
  maquinaNome: string
  maquinaCodigo: string
  tipoDefeito?: TipoDefeito
  status: StatusSolicitacao
  descricao: string
  solicitante: string
  criadoEm: string
  setor: Setor
  lojaId: string
  impactos: MarcadorImpacto[]
  origem: OrigemSolicitacao
  preventivaId?: string
  // Pequenos Reparos (sem máquina cadastrada): foto do item. Maquinário: foto do
  // defeito constatado na hora da solicitação, evidência para o Gestor avaliar.
  fotoUrl?: string
  // Vídeo do defeito, opcional — só na OS de Maquinário (item 3).
  videoUrl?: string
}

export const niveisUrgencia = ['Baixa', 'Média', 'Alta'] as const

export type IdUrgencia = (typeof niveisUrgencia)[number]

export interface AberturaOrdemServicoPayload {
  solicitacaoId: number
  urgencia: IdUrgencia
  dataHora: string
  tecnicoId: string
}

// Aprovação de OS Terceiros pelo Gestor: diferente da abertura de OS de Maquinário/Reparo
// (acima), não há Técnico nem Urgência — o Gestor só escolhe a empresa terceirizada
// responsável pelo reparo. Ver regra de negócio no CLAUDE.md (item 3c/6).
export interface AprovacaoOSTerceirosPayload {
  solicitacaoId: number
  empresaTerceirizadaId: string
  dataHora: string
}

export const statusExecucaoOS = ['Aberta', 'Em Andamento', 'Pausada', 'Concluída'] as const

export type StatusExecucaoOS = (typeof statusExecucaoOS)[number]

// Status para o qual a OS deve voltar ao ser retomada de uma pausa.
export type StatusRetomavel = Extract<StatusExecucaoOS, 'Aberta' | 'Em Andamento'>

export interface OrdemServico {
  id: number
  solicitacaoId: number
  tipo: TipoOS
  maquinaNome: string
  maquinaCodigo: string
  descricao: string
  setor: Setor
  lojaId: string
  solicitante: string
  // Maquinário/Reparo: Técnico interno + Urgência definidos pelo Gestor ao abrir a OS.
  // Terceiros: sem Urgência, o Gestor escolhe a empresa terceirizada responsável.
  urgencia?: IdUrgencia
  tecnicoId?: string
  empresaTerceirizadaId?: string
  statusExecucao: StatusExecucaoOS
  dataAbertura: string
  motivoPausa?: string
  statusAntesDaPausa?: StatusRetomavel
  dataInicio?: string
  dataFim?: string
  // Controle do relógio de horas do técnico, independente do tempo de máquina parada
  // (dataAbertura → dataFim, esse sim corrido): horasTrabalhadasAcumuladas guarda o que
  // já foi fechado em sessões anteriores, e sessaoAtualInicio marca o início da sessão
  // ativa (undefined enquanto a OS está Pausada ou antes de "Iniciar Atendimento").
  horasTrabalhadasAcumuladas?: number
  sessaoAtualInicio?: string
  horasTrabalhadas?: number
  custoHoraTecnico?: number
  custoManutencao?: number
  defeitoConstatado?: string
  causaRaiz?: string
  solucao?: string
}

// Payload interno usado por servicoOrdensServico.criar — construído por
// servicoSolicitacoes.abrirOS/aprovarTerceiros a partir da SolicitacaoOS de origem.
export type NovaOrdemServicoPayload = Omit<OrdemServico, 'id'>

export interface EncerramentoOrdemServicoPayload {
  ordemServicoId: number
  dataInicio: string
  dataFim: string
  horasTrabalhadas: number
  custoHoraTecnico: number
  defeitoConstatado: string
  causaRaiz: string
  solucao: string
}

export interface LancamentoCustoManutencaoPayload {
  ordemServicoId: number
  custoManutencao: number
}
