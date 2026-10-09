import type { TipoDefeito } from './ordemServico'

export interface IndicadorPorDefeito {
  tipoDefeito: TipoDefeito
  horasParada: number
}

// Cards e rosca do painel. Vem para o histórico inteiro (IndicadoresMaquina) e para
// cada mês (IndicadorMensal): clicar numa barra troca um pelo outro.
export interface ResumoIndicadores {
  horasParadaTotal: number
  mttrHoras: number
  mtbfHoras: number
  custoTotal: number
  porTipoDefeito: IndicadorPorDefeito[]
}

export interface IndicadorMensal extends ResumoIndicadores {
  mes: string
}

export interface IndicadoresMaquina extends ResumoIndicadores {
  maquinaId: number
  porMes: IndicadorMensal[]
}
