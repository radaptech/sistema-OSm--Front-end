export const tiposDefeito = [
  'Mecânico',
  'Elétrico',
  'Hidráulico',
  'Pneumático',
  'Software / CNC',
  'Estrutural',
] as const

export type TipoDefeito = (typeof tiposDefeito)[number]

export interface NovaSolicitacaoOSPayload {
  maquinaId: string
  tipoDefeito: TipoDefeito
  descricao: string
  setor: string
  solicitante: string
}

export const statusSolicitacao = ['Pendente', 'Convertida', 'Rejeitada'] as const

export type StatusSolicitacao = (typeof statusSolicitacao)[number]

export interface SolicitacaoOS {
  id: number
  maquinaNome: string
  maquinaCodigo: string
  status: StatusSolicitacao
  descricao: string
  solicitante: string
  criadoEm: string
}
