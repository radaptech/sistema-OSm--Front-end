import { api } from './api'
import { montarQuery } from './montarQuery'
import type {
  AtualizarSetorPayload,
  NovoSetorPayload,
  SetorCadastrado,
} from '../tipos/setor'

export interface ParametrosListagemSetores {
  lojaId?: number
}

export const servicoSetores = {
  listar: (parametros: ParametrosListagemSetores = {}) =>
    api.get<SetorCadastrado[]>(`/setores${montarQuery(parametros)}`),

  obterPorId: (id: number) => api.get<SetorCadastrado>(`/setores/${id}`),

  criar: (dados: NovoSetorPayload) => api.post<SetorCadastrado>('/setores', dados),

  atualizar: ({ id, ...dados }: AtualizarSetorPayload) =>
    api.put<SetorCadastrado>(`/setores/${id}`, dados),

  deletar: (id: number) => api.delete<void>(`/setores/${id}`),
}
