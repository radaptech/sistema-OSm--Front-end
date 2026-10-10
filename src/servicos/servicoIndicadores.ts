import { api } from './api'
import type {
  IndicadoresLoja,
  IndicadoresMaquina,
} from '../tipos/indicadorMaquina'

export const servicoIndicadores = {
  obterPorMaquina: (maquinaId: number) =>
    api.get<IndicadoresMaquina>(`/indicadores/maquinas/${maquinaId}`),
  obterPorLoja: (lojaId: number) =>
    api.get<IndicadoresLoja>(`/indicadores/lojas/${lojaId}`),
}
