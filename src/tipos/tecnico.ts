export const areasTecnico = [
  'Refrigeração',
  'Elétrica',
  'Mecânica',
  'Hidráulica',
  'Máquinas em Geral',
] as const

export type AreaTecnico = (typeof areasTecnico)[number]

export interface Tecnico {
  id: string
  nome: string
  email: string
  telefone?: string
  area: AreaTecnico
  lojasIds: string[]
  valorHora: number
}

export interface NovoTecnicoPayload {
  nome: string
  email: string
  telefone?: string
  area: AreaTecnico
  lojasIds: string[]
  valorHora: number
}

export interface AtualizarTecnicoPayload extends NovoTecnicoPayload {
  id: string
}
