import type { Setor } from './maquina'

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
  maquinaNome: string
  maquinaCodigo: string
  status: StatusSolicitacao
  descricao: string
  solicitante: string
  criadoEm: string
  setor: Setor
  lojaId: string
  impactos: MarcadorImpacto[]
  origem: OrigemSolicitacao
  preventivaId?: string
}

export const niveisUrgencia = ['Baixa', 'Média', 'Alta'] as const

export type IdUrgencia = (typeof niveisUrgencia)[number]

export interface AberturaOrdemServicoPayload {
  solicitacaoId: number
  urgencia: IdUrgencia
  dataHora: string
  tecnicoId: string
}

export const statusExecucaoOS = ['Aberta', 'Em Andamento', 'Pausada', 'Concluída'] as const

export type StatusExecucaoOS = (typeof statusExecucaoOS)[number]

// Status para o qual a OS deve voltar ao ser retomada de uma pausa.
export type StatusRetomavel = Extract<StatusExecucaoOS, 'Aberta' | 'Em Andamento'>

export interface OrdemServico {
  id: number
  solicitacaoId: number
  maquinaNome: string
  maquinaCodigo: string
  descricao: string
  setor: Setor
  lojaId: string
  solicitante: string
  urgencia: IdUrgencia
  tecnicoId: string
  statusExecucao: StatusExecucaoOS
  dataAbertura: string
  motivoPausa?: string
  statusAntesDaPausa?: StatusRetomavel
  dataInicio?: string
  dataFim?: string
  horaEstimada?: number
  custo?: number
  defeitoConstatado?: string
  causaRaiz?: string
  solucao?: string
}

export interface EncerramentoOrdemServicoPayload {
  ordemServicoId: number
  dataInicio: string
  dataFim: string
  horaEstimada: number
  custo: number
  defeitoConstatado: string
  causaRaiz: string
  solucao: string
}
