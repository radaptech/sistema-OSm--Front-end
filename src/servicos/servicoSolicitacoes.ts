import { api } from './api'
import { montarMultipart } from './montarMultipart'
import { montarQuery } from './montarQuery'
import type {
  AberturaOrdemServicoPayload,
  AprovacaoOSTerceirosPayload,
  NovaSolicitacaoOSPayload,
  OrdemServico,
  ResumoSolicitacoes,
  SolicitacaoOS,
  StatusSolicitacao,
  TipoOS,
} from '../tipos/ordemServico'
import type { RespostaPaginada } from '../tipos/paginacao'

export interface ParametrosListagemSolicitacoes {
  pagina: number
  status?: StatusSolicitacao
  busca?: string
}

export interface ParametrosFilaGestor {
  status?: StatusSolicitacao
  tipo?: TipoOS
  lojaId?: number
  busca?: string
  pagina?: number
}

export const servicoSolicitacoes = {
  criar: (dados: NovaSolicitacaoOSPayload, fotoDefeito: File, videoDefeito?: File) =>
    api.post<SolicitacaoOS>(
      '/solicitacoes/maquinario',
      montarMultipart(dados, { foto: fotoDefeito, video: videoDefeito }),
    ),

  // Minhas Solicitações — o servidor restringe ao solicitante autenticado.
  listar: (parametros: ParametrosListagemSolicitacoes) =>
    api.get<RespostaPaginada<SolicitacaoOS>>(`/solicitacoes/minhas${montarQuery(parametros)}`),

  // Fila do Gestor — já filtrada pelo escopo de Loja/Setor no servidor.
  listarTodas: (parametros: ParametrosFilaGestor = {}) =>
    api.get<SolicitacaoOS[]>(`/solicitacoes${montarQuery(parametros)}`),

  obterPorId: (id: number) => api.get<SolicitacaoOS>(`/solicitacoes/${id}`),

  // Contadores da Home do Solicitante.
  obterResumo: () => api.get<ResumoSolicitacoes>('/solicitacoes/resumo'),

  // Maquinário/Reparo: atribui Técnico e Urgência, criando a OS. O instante da abertura é
  // fato do servidor — não é enviado pelo cliente.
  abrirOS: ({ solicitacaoId, ...dados }: AberturaOrdemServicoPayload) =>
    api.post<OrdemServico>(`/solicitacoes/${solicitacaoId}/abrir-os`, dados),

  // Terceiros: a OS já nasce Concluída, sem Técnico nem Urgência.
  aprovarTerceiros: ({ solicitacaoId, ...dados }: AprovacaoOSTerceirosPayload) =>
    api.post<OrdemServico>(`/solicitacoes/${solicitacaoId}/aprovar-terceiros`, dados),

  rejeitar: (solicitacaoId: number, motivo: string) =>
    api.post<SolicitacaoOS>(`/solicitacoes/${solicitacaoId}/rejeitar`, { motivo }),
}
