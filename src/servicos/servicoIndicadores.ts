import { api } from './api'
import type { IndicadoresMaquina } from '../tipos/indicadorMaquina'

export const servicoIndicadores = {
  obterPorMaquina: (maquinaId: number) =>
    api.get<IndicadoresMaquina>(`/indicadores/maquinas/${maquinaId}`),
}
