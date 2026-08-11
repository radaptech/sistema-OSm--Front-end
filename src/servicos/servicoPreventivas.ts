import { api } from './api'
import { montarQuery } from './montarQuery'
import type { PreventivaListada, PreventivaManutencao } from '../tipos/maquina'

export interface ParametrosListagemPreventivas {
  maquinaId?: number
}

export const servicoPreventivas = {
  listar: (parametros: ParametrosListagemPreventivas = {}) =>
    api.get<PreventivaListada[]>(`/preventivas${montarQuery(parametros)}`),

  criar: (dados: PreventivaManutencao) =>
    api.post<PreventivaListada>('/preventivas', dados),

  atualizar: (id: number, dados: PreventivaManutencao) =>
    api.put<PreventivaListada>(`/preventivas/${id}`, dados),

  deletar: (id: number) => api.delete<void>(`/preventivas/${id}`),
}
