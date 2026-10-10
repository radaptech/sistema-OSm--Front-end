import type { TipoDefeito } from './ordemServico'

export interface IndicadorPorDefeito {
  tipoDefeito: TipoDefeito
  horasParada: number
}

// Cards e rosca do painel. Vem para o histórico inteiro (IndicadoresMaquina) e para
// cada mês (IndicadorMensal): clicar numa barra troca um pelo outro.
export interface ResumoIndicadores {
  // Quantas OS encerradas entraram na conta (no total ou no mês).
  quantidadeOs: number
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

// GET /indicadores/lojas/:id — a tela da loja no Painel de Indicadores: o total, um
// card por setor e um por máquina, todos recortados pelo escopo do Gestor (com só dois
// setores da loja, a "loja" é a soma desses dois). Setor e máquina trazem o próprio
// porMes porque o mês clicado no gráfico da loja filtra todos os cards da tela.
export interface IndicadorSetor extends ResumoIndicadores {
  setorId: number
  setorNome: string
  quantidadeMaquinas: number
  porMes: IndicadorMensal[]
}

export interface IndicadorMaquinaResumo extends ResumoIndicadores {
  maquinaId: number
  setorId: number
  porMes: IndicadorMensal[]
}

export interface IndicadoresLoja extends ResumoIndicadores {
  lojaId: number
  porMes: IndicadorMensal[]
  porSetor: IndicadorSetor[]
  porMaquina: IndicadorMaquinaResumo[]
}
