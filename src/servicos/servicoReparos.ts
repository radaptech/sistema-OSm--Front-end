import { atrasoSimulado } from './atrasoSimulado'
import { gerarProximoIdSolicitacao, SOLICITACOES_MOCK } from './dadosMockSolicitacoes'
import type { NovaSolicitacaoReparoPayload } from '../tipos/reparo'
import type { SolicitacaoOS } from '../tipos/ordemServico'

// Desvio deliberado — mock-first: para o Pequeno Reparo entrar no mesmo pipeline de
// aprovação do Gestor (item 6/3c), a solicitação precisa existir em SOLICITACOES_MOCK.
// A foto usa URL.createObjectURL (mesma estratégia de CadastrarMaquina, item 5), já que
// não há endpoint real de upload.
function criar(dados: NovaSolicitacaoReparoPayload, foto?: File): Promise<SolicitacaoOS> {
  const solicitacao: SolicitacaoOS = {
    id: gerarProximoIdSolicitacao(),
    tipo: 'reparo',
    maquinaNome: dados.item,
    maquinaCodigo: '—',
    status: 'Pendente',
    descricao: dados.descricao,
    solicitante: dados.solicitante,
    criadoEm: dados.dataHora,
    setor: dados.setor,
    lojaId: dados.lojaId,
    impactos: [],
    origem: 'solicitante',
    fotoUrl: foto ? URL.createObjectURL(foto) : undefined,
  }

  SOLICITACOES_MOCK.push(solicitacao)

  return atrasoSimulado(solicitacao)
}

export const servicoReparos = {
  criar,
}
