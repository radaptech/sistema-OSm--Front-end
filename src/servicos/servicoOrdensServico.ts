import { api } from './api'
import { montarQuery } from './montarQuery'
import type {
  EncerramentoOrdemServicoPayload,
  LancamentoCustoManutencaoPayload,
  OrdemServico,
  StatusExecucaoOS,
  TipoOS,
} from '../tipos/ordemServico'

export interface ParametrosListagemOrdensServico {
  status?: StatusExecucaoOS[]
  finalizada?: boolean
  tipo?: TipoOS
  lojaId?: number
  tecnicoId?: number
  busca?: string
  pagina?: number
}

// Um endpoint serve os três painéis; o que muda é o filtro. O escopo (OS do técnico
// autenticado, lojas/setores do gestor) é sempre aplicado no servidor.
export const servicoOrdensServico = {
  listar: (parametros: ParametrosListagemOrdensServico = {}) =>
    api.get<OrdemServico[]>(`/ordens-servico${montarQuery(parametros)}`),

  obterPorId: (id: number) => api.get<OrdemServico>(`/ordens-servico/${id}`),

  iniciar: (id: number) => api.post<OrdemServico>(`/ordens-servico/${id}/iniciar`),

  pausar: (id: number, motivo: string) =>
    api.post<OrdemServico>(`/ordens-servico/${id}/pausar`, { motivo }),

  retomar: (id: number) => api.post<OrdemServico>(`/ordens-servico/${id}/retomar`),

  encerrar: ({ ordemServicoId, ...dados }: EncerramentoOrdemServicoPayload) =>
    api.post<OrdemServico>(`/ordens-servico/${ordemServicoId}/encerrar`, dados),

  lancarCustoManutencao: ({
    ordemServicoId,
    ...dados
  }: LancamentoCustoManutencaoPayload) =>
    api.post<OrdemServico>(`/ordens-servico/${ordemServicoId}/custo`, dados),

  obterPdfImpressao: (id: number) =>
    api.get<Blob>(`/ordens-servico/${id}/impressao`),
}
