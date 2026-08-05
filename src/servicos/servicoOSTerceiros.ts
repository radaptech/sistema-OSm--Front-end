import { atrasoSimulado } from './atrasoSimulado'
import { gerarProximoIdSolicitacao, SOLICITACOES_MOCK } from './dadosMockSolicitacoes'
import type { NovaSolicitacaoOSTerceirosPayload } from '../tipos/osTerceiros'
import type { Setor } from '../tipos/maquina'
import type { SolicitacaoOS } from '../tipos/ordemServico'

// Desvio deliberado — mock-first: para a OS Terceiros entrar no mesmo pipeline de
// aprovação do Gestor (item 6/3c), a solicitação precisa existir em SOLICITACOES_MOCK —
// inclusive com a Foto do Defeito (obrigatória) e o Vídeo do Defeito (opcional),
// registrados via URL.createObjectURL (mesmo padrão do item 3, Maquinário).
// A empresa terceirizada responsável NÃO é definida aqui — o Gestor escolhe ao aprovar
// (ver servicoSolicitacoes.aprovarTerceiros).
function criar(
  dados: NovaSolicitacaoOSTerceirosPayload,
  fotoDefeito: File,
  videoDefeito?: File,
): Promise<SolicitacaoOS> {
  const solicitacao: SolicitacaoOS = {
    id: gerarProximoIdSolicitacao(),
    tipo: 'terceiros',
    maquinaNome: dados.maquinaNome,
    maquinaCodigo: dados.maquinaId,
    tipoDefeito: dados.tipoDefeito,
    status: 'Pendente',
    descricao: dados.descricao,
    solicitante: dados.solicitante,
    criadoEm: dados.dataHora,
    setor: dados.setor as Setor,
    lojaId: dados.lojaId,
    impactos: [],
    origem: 'solicitante',
    fotoUrl: URL.createObjectURL(fotoDefeito),
    videoUrl: videoDefeito ? URL.createObjectURL(videoDefeito) : undefined,
  }

  SOLICITACOES_MOCK.push(solicitacao)

  return atrasoSimulado(solicitacao)
}

export const servicoOSTerceiros = {
  criar,
}
