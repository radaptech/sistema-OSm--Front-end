import { api } from './api'
import type {
  AtualizarEmpresaTerceirizadaPayload,
  EmpresaTerceirizada,
  NovaEmpresaTerceirizadaPayload,
} from '../tipos/empresaTerceirizada'

const BASE = '/empresas-terceirizadas'

export const servicoEmpresasTerceirizadas = {
  listar: () => api.get<EmpresaTerceirizada[]>(BASE),

  obterPorId: (id: number) => api.get<EmpresaTerceirizada>(`${BASE}/${id}`),

  criar: (dados: NovaEmpresaTerceirizadaPayload) =>
    api.post<EmpresaTerceirizada>(BASE, dados),

  atualizar: ({ id, ...dados }: AtualizarEmpresaTerceirizadaPayload) =>
    api.put<EmpresaTerceirizada>(`${BASE}/${id}`, dados),

  deletar: (id: number) => api.delete<void>(`${BASE}/${id}`),
}
