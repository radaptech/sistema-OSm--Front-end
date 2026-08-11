import { api } from './api'
import { montarMultipart } from './montarMultipart'
import type { NovaSolicitacaoReparoPayload } from '../tipos/reparo'
import type { SolicitacaoOS } from '../tipos/ordemServico'

export const servicoReparos = {
  criar: (dados: NovaSolicitacaoReparoPayload, foto?: File) =>
    api.post<SolicitacaoOS>('/solicitacoes/reparo', montarMultipart(dados, { foto })),
}
