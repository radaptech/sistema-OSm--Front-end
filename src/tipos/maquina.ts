export interface Maquina {
  id: string
  nome: string
  setor: string
  lojaId: string
  fotoUrl?: string
}

export const niveisCriticidade = ['Baixa', 'Média', 'Alta'] as const

export type NivelCriticidade = (typeof niveisCriticidade)[number]

export const setoresDisponiveis = [
  'Padaria',
  'Açougue',
  'Hortifruti',
  'Peixaria',
  'Frios e Laticínios',
  'Estoque',
  'Frente de Loja',
] as const

export type Setor = (typeof setoresDisponiveis)[number]

export interface PreventivaManutencao {
  maquinaId: string
  descricao: string
  intervaloDias: number
  proximaData: string
  ativa: boolean
}

export interface NovaMaquinaPayload {
  tag: string
  nome: string
  descricao?: string
  marca?: string
  modelo?: string
  criticidade: NivelCriticidade
  setor: Setor
  lojaId: string
  preventivas: PreventivaManutencao[]
}
