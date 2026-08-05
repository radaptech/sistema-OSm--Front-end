import { atrasoSimulado } from './atrasoSimulado'
import { gerarProximoIdSolicitacao, SOLICITACOES_MOCK } from './dadosMockSolicitacoes'
import { PREVENTIVAS_MOCK } from './dadosMockPreventivas'
import { MAQUINAS_MOCK } from './dadosMockMaquinas'
import { servicoOrdensServico } from './servicoOrdensServico'
import { gerarSolicitacoesPreventivasVencidas } from '../utilitarios/gerarSolicitacoesPreventivas'
import type {
  AberturaOrdemServicoPayload,
  AprovacaoOSTerceirosPayload,
  NovaSolicitacaoOSPayload,
  OrdemServico,
  SolicitacaoOS,
  StatusSolicitacao,
} from '../tipos/ordemServico'
import type { Setor } from '../tipos/maquina'
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
    const combinaStatus =
      !parametros.status || solicitacao.status === parametros.status
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

// Desvio deliberado — mock-first: para o fluxo de aprovação do Gestor → custo do
// Administrador → Finalizada ser demonstrável de ponta a ponta sem back-end (mesmo
// motivo dos itens 9/11/12 do CLAUDE.md), a solicitação de OS de Maquinário já nasce
// direto em SOLICITACOES_MOCK — inclusive com a Foto do Defeito (obrigatória) e o
// Vídeo do Defeito (opcional) registrados via URL.createObjectURL, mesma estratégia já
// usada em CadastrarMaquina/servicoReparos.
function criar(
  dados: NovaSolicitacaoOSPayload,
  fotoDefeito: File,
  videoDefeito?: File,
): Promise<SolicitacaoOS> {
  const maquina = MAQUINAS_MOCK.find((item) => item.id === dados.maquinaId)

  const solicitacao: SolicitacaoOS = {
    id: gerarProximoIdSolicitacao(),
    tipo: 'maquinario',
    maquinaNome: maquina?.nome ?? '—',
    maquinaCodigo: dados.maquinaId,
    tipoDefeito: dados.tipoDefeito,
    status: 'Pendente',
    descricao: dados.descricao,
    solicitante: dados.solicitante,
    criadoEm: dados.dataHora,
    setor: dados.setor as Setor,
    lojaId: dados.lojaId,
    impactos: dados.impactos,
    origem: 'solicitante',
    fotoUrl: URL.createObjectURL(fotoDefeito),
    videoUrl: videoDefeito ? URL.createObjectURL(videoDefeito) : undefined,
  }

  SOLICITACOES_MOCK.push(solicitacao)

  return atrasoSimulado(solicitacao)
}

function abrirOS(dados: AberturaOrdemServicoPayload): Promise<OrdemServico> {
  const solicitacao = SOLICITACOES_MOCK.find((item) => item.id === dados.solicitacaoId)

  if (solicitacao) {
    solicitacao.status = 'Convertida'
  }

  return servicoOrdensServico.criar({
    solicitacaoId: dados.solicitacaoId,
    tipo: solicitacao?.tipo ?? 'maquinario',
    maquinaNome: solicitacao?.maquinaNome ?? '—',
    maquinaCodigo: solicitacao?.maquinaCodigo ?? '—',
    descricao: solicitacao?.descricao ?? '',
    setor: solicitacao?.setor ?? 'Padaria',
    lojaId: solicitacao?.lojaId ?? '',
    solicitante: solicitacao?.solicitante ?? '',
    urgencia: dados.urgencia,
    tecnicoId: dados.tecnicoId,
    statusExecucao: 'Aberta',
    dataAbertura: dados.dataHora,
  })
}

// Aprovação de OS Terceiros: sem Técnico nem estados Aberta/Em Andamento/Pausada —
// quem executa o reparo é a empresa terceirizada, fora do sistema. A OS já nasce
// Concluída, indo direto para "Custos Pendentes" do Administrador (ver item 3c/6).
function aprovarTerceiros(dados: AprovacaoOSTerceirosPayload): Promise<OrdemServico> {
  const solicitacao = SOLICITACOES_MOCK.find((item) => item.id === dados.solicitacaoId)

  if (solicitacao) {
    solicitacao.status = 'Convertida'
  }

  return servicoOrdensServico.criar({
    solicitacaoId: dados.solicitacaoId,
    tipo: 'terceiros',
    maquinaNome: solicitacao?.maquinaNome ?? '—',
    maquinaCodigo: solicitacao?.maquinaCodigo ?? '—',
    descricao: solicitacao?.descricao ?? '',
    setor: solicitacao?.setor ?? 'Padaria',
    lojaId: solicitacao?.lojaId ?? '',
    solicitante: solicitacao?.solicitante ?? '',
    empresaTerceirizadaId: dados.empresaTerceirizadaId,
    statusExecucao: 'Concluída',
    dataAbertura: dados.dataHora,
    dataInicio: dados.dataHora,
    dataFim: dados.dataHora,
  })
}

export const servicoSolicitacoes = {
  criar,

  listar: listarMock,

  listarTodas: (): Promise<SolicitacaoOS[]> => {
    const solicitacoesPreventivas = gerarSolicitacoesPreventivasVencidas(
      PREVENTIVAS_MOCK,
      SOLICITACOES_MOCK,
    )

    // Copia rasa de cada item: abrirOS/aprovarTerceiros mutam `status` in-place na
    // SolicitacaoOS original, então devolver os mesmos objetos faria o structuralSharing
    // do React Query não detectar a mudança (mesmo ajuste em servicoOrdensServico).
    return atrasoSimulado(
      [...solicitacoesPreventivas, ...SOLICITACOES_MOCK].map((solicitacao) => ({
        ...solicitacao,
      })),
    )
  },

  abrirOS,
  aprovarTerceiros,
}
