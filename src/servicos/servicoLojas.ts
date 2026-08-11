import { api } from './api'
import type { AtualizarLojaPayload, Loja, NovaLojaPayload } from '../tipos/loja'

export const servicoLojas = {
  listar: () => api.get<Loja[]>('/lojas'),

  obterPorId: (id: number) => api.get<Loja>(`/lojas/${id}`),

  criar: (dados: NovaLojaPayload) => api.post<Loja>('/lojas', dados),

  atualizar: ({ id, ...dados }: AtualizarLojaPayload) =>
    api.put<Loja>(`/lojas/${id}`, dados),

  deletar: (id: number) => api.delete<void>(`/lojas/${id}`),
}
