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
  area: AreaTecnico
  lojasIds: string[]
}
