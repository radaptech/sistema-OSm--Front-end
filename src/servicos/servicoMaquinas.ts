import { api } from './api'
import { montarMultipart } from './montarMultipart'
import { montarQuery } from './montarQuery'
import { converterDataFormularioParaBackend } from '../utilitarios/dataBackend'
import type {
  AtualizarMaquinaPayload,
  Maquina,
  NovaMaquinaPayload,
} from '../tipos/maquina'

export interface ParametrosListagemMaquinas {
  setorId?: number
  lojaId?: number
}

// As preventivas viajam junto com a máquina: a regra de negócio exige ao menos uma, e
// servidor grava as duas coisas na mesma transação. proximaData vem do <input type="date">
// em YYYY-MM-DD e precisa virar dd/mm/yyyy antes de sair.
function prepararPayload(dados: NovaMaquinaPayload) {
  return {
    ...dados,
    preventivas: dados.preventivas.map((preventiva) => ({
      ...preventiva,
      proximaData: converterDataFormularioParaBackend(preventiva.proximaData),
    })),
  }
}

export const servicoMaquinas = {
  listar: (parametros: ParametrosListagemMaquinas = {}) =>
    api.get<Maquina[]>(`/maquinas${montarQuery(parametros)}`),

  obterPorId: (id: number) => api.get<Maquina>(`/maquinas/${id}`),

  criar: (dados: NovaMaquinaPayload, foto?: File) =>
    api.post<Maquina>('/maquinas', montarMultipart(prepararPayload(dados), { foto })),

  atualizar: ({ id, ...dados }: AtualizarMaquinaPayload, foto?: File) =>
    api.put<Maquina>(
      `/maquinas/${id}`,
      montarMultipart(prepararPayload(dados), { foto }),
    ),

  deletar: (id: number) => api.delete<void>(`/maquinas/${id}`),
}
