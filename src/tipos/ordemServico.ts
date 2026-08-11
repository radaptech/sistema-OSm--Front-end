export const tiposOS = ['maquinario', 'terceiros', 'reparo'] as const

export type TipoOS = (typeof tiposOS)[number]

export const tiposDefeito = [
  'Mecânico',
  'Elétrico',
  'Hidráulico',
  'Pneumático',
  'Software / CNC',
  'Estrutural',
] as const

export type TipoDefeito = (typeof tiposDefeito)[number]

export const marcadoresImpacto = [
  'Afeta Produção',
  'Parada Parcial',
  'Retrabalho',
] as const

export type MarcadorImpacto = (typeof marcadoresImpacto)[number]

// Enviado como parte "dados" do multipart — a foto do defeito é obrigatória e vai como
// arquivo. Setor, loja, solicitante e data/hora NÃO são enviados: o servidor deriva da
// máquina e da sessão autenticada.
export interface NovaSolicitacaoOSPayload {
  maquinaId: number
  tipoDefeito: TipoDefeito
  descricao: string
  impactos: MarcadorImpacto[]
}

export const statusSolicitacao = [
  'Pendente',
  'Convertida',
  'Rejeitada',
] as const

export type StatusSolicitacao = (typeof statusSolicitacao)[number]

export const origensSolicitacao = ['solicitante', 'preventiva'] as const

export type OrigemSolicitacao = (typeof origensSolicitacao)[number]

export interface AnexoSolicitacao {
  id: number
  tipo: 'foto' | 'video'
  url: string
}

export interface SolicitacaoOS {
  id: number
  tipo: TipoOS
  // Reparo não tem máquina cadastrada: maquinaId vem nulo e itemDescricao traz o texto
  // livre digitado pelo Solicitante.
  maquinaId: number | null
  maquinaNome: string | null
  maquinaCodigo: string | null
  // Foto de cadastro da máquina, resolvida pelo servidor — evita uma segunda consulta só
  // para mostrar a máquina no modal de detalhes.
  maquinaFotoUrl?: string
  itemDescricao: string | null
  tipoDefeito?: TipoDefeito
  status: StatusSolicitacao
  descricao: string
  // Nulo quando origem === 'preventiva': a solicitação foi aberta pelo job, sem pessoa.
  solicitanteId: number | null
  solicitanteNome: string | null
  criadoEm: string
  setorId: number
  setorNome: string
  lojaId: number
  lojaNome: string
  impactos: MarcadorImpacto[]
  origem: OrigemSolicitacao
  preventivaId?: number
  anexos: AnexoSolicitacao[]
}

export const niveisUrgencia = ['Baixa', 'Média', 'Alta'] as const

export type IdUrgencia = (typeof niveisUrgencia)[number]

export interface AberturaOrdemServicoPayload {
  solicitacaoId: number
  urgencia: IdUrgencia
  tecnicoId: number
}

// Aprovação de OS Terceiros pelo Gestor: sem Técnico nem Urgência — o Gestor só escolhe a
// empresa terceirizada responsável pelo reparo.
export interface AprovacaoOSTerceirosPayload {
  solicitacaoId: number
  empresaTerceirizadaId: number
}

export const statusExecucaoOS = ['Aberta', 'Em Andamento', 'Pausada', 'Concluída'] as const

export type StatusExecucaoOS = (typeof statusExecucaoOS)[number]

// Status para o qual a OS deve voltar ao ser retomada de uma pausa.
export type StatusRetomavel = Extract<StatusExecucaoOS, 'Aberta' | 'Em Andamento'>

export interface PausaOrdemServico {
  id: number
  motivo: string
  pausadaEm: string
  retomadaEm: string | null
  statusAnterior: StatusRetomavel
}

export interface CustoOrdemServico {
  custoHoraTecnico: number | null
  custoManutencao: number
  custoTotal: number
  // Preenchido apenas em OS Terceiros: o que a empresa efetivamente fez.
  descricaoServico: string | null
  lancadoPorNome: string
  lancadoEm: string
}

export interface EncerramentoOrdemServico {
  defeitoConstatado: string
  causaRaiz: string
  solucao: string
  encerradoPorNome: string
}

export interface OrdemServico {
  id: number
  solicitacaoId: number
  tipo: TipoOS
  maquinaId: number | null
  maquinaNome: string | null
  maquinaCodigo: string | null
  itemDescricao: string | null
  descricao: string
  setorId: number
  setorNome: string
  lojaId: number
  lojaNome: string
  solicitanteNome: string | null
  // Maquinário/Reparo: Técnico interno + Urgência definidos pelo Gestor ao abrir a OS.
  // Terceiros: sem Urgência nem Técnico — a empresa terceirizada é a responsável.
  urgencia?: IdUrgencia
  tecnicoId?: number
  tecnicoNome?: string
  tecnicoArea?: string
  empresaTerceirizadaId?: number
  empresaTerceirizadaNome?: string
  statusExecucao: StatusExecucaoOS
  // Uma OS só é "finalizada" quando o Técnico encerrou E o custo foi lançado. O servidor
  // resolve essa regra e devolve pronta, em vez de cada tela recalcular.
  finalizada: boolean
  dataAbertura: string
  dataInicio?: string
  dataFim?: string
  // Horas já calculadas pelo servidor a partir de dataAbertura/dataInicio/dataFim e do
  // histórico de pausas. Só existem em OS encerrada.
  horasTrabalhadas?: number
  horasParada?: number
  // Pausa em aberto no momento — presente somente enquanto statusExecucao === 'Pausada'.
  pausaAtual?: PausaOrdemServico
  pausas?: PausaOrdemServico[]
  encerramento?: EncerramentoOrdemServico
  custo?: CustoOrdemServico
}

export interface EncerramentoOrdemServicoPayload {
  ordemServicoId: number
  defeitoConstatado: string
  causaRaiz: string
  solucao: string
  custoHoraTecnico: number
  custoManutencao: number
}

export interface LancamentoCustoManutencaoPayload {
  ordemServicoId: number
  custoManutencao: number
  custoHoraTecnico?: number
  descricaoServico?: string
}

// Contadores da Home do Solicitante.
export interface ResumoSolicitacoes {
  abertas: number
  emAndamento: number
  concluidas: number
}
