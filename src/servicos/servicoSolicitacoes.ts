import { api } from './api'
import { atrasoSimulado } from './atrasoSimulado'
import { SOLICITACOES_MOCK } from './dadosMockSolicitacoes'
import type {
  NovaSolicitacaoOSPayload,
  SolicitacaoOS,
  StatusSolicitacao,
} from '../tipos/ordemServico'
import type { RespostaPaginada } from '../tipos/paginacao'

export interface ParametrosListagemSolicitacoes {
  pagina: number
  status?: StatusSolicitacao
  busca?: string
}

const TAMANHO_PAGINA = 6

function listarMock(
  parametros: ParametrosListagemSolicitacoes,
): Promise<RespostaPaginada<SolicitacaoOS>> {
  const termoBusca = parametros.busca?.trim().toLowerCase()

  const filtradas = SOLICITACOES_MOCK.filter((solicitacao) => {
    const combinaStatus = !parametros.status || solicitacao.status === parametros.status
    const combinaBusca =
      !termoBusca ||
      solicitacao.maquinaNome.toLowerCase().includes(termoBusca) ||
      solicitacao.descricao.toLowerCase().includes(termoBusca)

    return combinaStatus && combinaBusca
  })

  const total = filtradas.length
  const totalPaginas = Math.max(1, Math.ceil(total / TAMANHO_PAGINA))
  const pagina = Math.min(Math.max(1, parametros.pagina), totalPaginas)
  const inicio = (pagina - 1) * TAMANHO_PAGINA

  return atrasoSimulado({
    dados: filtradas.slice(inicio, inicio + TAMANHO_PAGINA),
    pagina,
    totalPaginas,
    total,
  })
}

export const servicoSolicitacoes = {
  criar: (dados: NovaSolicitacaoOSPayload) =>
    api.post('/solicitacoes-os', dados),

  listar: listarMock,
}
