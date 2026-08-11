import type { TipoDefeito } from './ordemServico'

export interface IndicadorPorDefeito {
  tipoDefeito: TipoDefeito
  horasParada: number
}

export interface IndicadorMensal {
  mes: string
  custoTotal: number
}

export interface IndicadoresMaquina {
  maquinaId: number
  horasParadaTotal: number
  mttrHoras: number
  mtbfHoras: number
  custoTotal: number
  porTipoDefeito: IndicadorPorDefeito[]
  porMes: IndicadorMensal[]
}
