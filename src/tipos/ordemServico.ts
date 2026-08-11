export const tiposOS = ['maquinario', 'terceiros', 'reparo'] as const

export type TipoOS = (typeof tiposOS)[number]

// O Solicitante abre apenas estes dois. `terceiros` NÃO é um tipo de pedido: é o desfecho
// de uma OS que o Técnico decidiu encaminhar para uma empresa externa (ver
// AcionamentoTerceiroPayload) — quem sabe se o caso é interno ou terceirizado é quem olha
// a máquina, não quem relata o problema.
export const tiposSolicitacao = ['maquinario', 'reparo'] as const

export type TipoSolicitacao = (typeof tiposSolicitacao)[number]

// Classificação exibida como "Tipo de OS": Predial (prédio/instalação) ou Corretiva
// (conserto do que quebrou).
// REGRA DE NEGÓCIO — quem classifica é quem executa: o Solicitante NÃO escolhe isso ao
// abrir o pedido (na prática ele não sabe distinguir os dois). A classificação entra no
// fim do fluxo, por quem viu o serviço: o Técnico ao encerrar a OS
// (EncerramentoOrdemServicoPayload) — inclusive quando o serviço foi executado por uma
// empresa externa, já que a OS continua sendo encerrada por ele.
// O campo trafega como `tipoDefeito` no contrato: renomeá-lo exigiria mudança simultânea
// no back-end, sem ganho funcional.
export const tiposDefeito = ['Predial', 'Corretiva'] as const

export type TipoDefeito = (typeof tiposDefeito)[number]

// Marcador único e opcional. Marcá-lo é o que liga o relógio de máquina parada da OS
// (ver `afetaProducao` em OrdemServico): sem ele, a máquina continua operando e a OS não
// acumula tempo de parada.
export const marcadoresImpacto = ['Afeta Produção'] as const

export type MarcadorImpacto = (typeof marcadoresImpacto)[number]

// Enviado como parte "dados" do multipart — a foto do defeito é obrigatória e vai como
// arquivo. Setor, loja, solicitante e data/hora NÃO são enviados: o servidor deriva da
// máquina e da sessão autenticada.
export interface NovaSolicitacaoOSPayload {
  maquinaId: number
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
  tipo: TipoSolicitacao
  // Reparo não tem máquina cadastrada: maquinaId vem nulo e itemDescricao traz o texto
  // livre digitado pelo Solicitante.
  maquinaId: number | null
  maquinaNome: string | null
  maquinaCodigo: string | null
  // Foto de cadastro da máquina, resolvida pelo servidor — evita uma segunda consulta só
  // para mostrar a máquina no modal de detalhes.
  maquinaFotoUrl?: string
  itemDescricao: string | null
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
  // Preenchidos pelo servidor quando status === 'Rejeitada'. O motivo é obrigatório na
  // rejeição justamente para o Solicitante saber o que corrigir antes de pedir de novo.
  motivoRejeicao?: string
  rejeitadoPorNome?: string
}

export const niveisUrgencia = ['Baixa', 'Média', 'Alta'] as const

export type IdUrgencia = (typeof niveisUrgencia)[number]

export interface AberturaOrdemServicoPayload {
  solicitacaoId: number
  urgencia: IdUrgencia
  tecnicoId: number
}

// Rejeição de uma solicitação Pendente pelo Gestor — o motivo volta para o Solicitante em
// Minhas Solicitações. Encerra a solicitação sem criar OrdemServico.
export interface RejeicaoSolicitacaoPayload {
  solicitacaoId: number
  motivo: string
}

// REGRA DE NEGÓCIO — terceirizar é decisão do Técnico, no meio da execução: ele recebe
// TODA OS, olha o problema e decide se resolve ou aciona uma empresa externa. Acionar não
// encerra nada: a OS continua com ele (mesma urgência, mesmos relógios) e só muda de
// `tipo` para 'terceiros', ganhando a empresa responsável. Quem encerra continua sendo o
// Técnico, quando a empresa termina o serviço.
export interface AcionamentoTerceiroPayload {
  ordemServicoId: number
  empresaTerceirizadaId: number
}

export const statusExecucaoOS = [
  'Aberta',
  'Em Andamento',
  'Pausada',
  'Concluída',
] as const

export type StatusExecucaoOS = (typeof statusExecucaoOS)[number]

// Status para o qual a OS deve voltar ao ser retomada de uma pausa.
export type StatusRetomavel = Extract<
  StatusExecucaoOS,
  'Aberta' | 'Em Andamento'
>

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
  // Classificado no fim do fluxo (ver `tiposDefeito`): indefinido enquanto a OS não for
  // encerrada pelo Técnico.
  tipoDefeito?: TipoDefeito
  setorId: number
  setorNome: string
  lojaId: number
  lojaNome: string
  solicitanteNome: string | null
  // Técnico + Urgência são definidos pelo Gestor ao abrir a OS, para todo tipo — toda OS
  // passa pelo Técnico. A empresa terceirizada só existe quando ele acionou uma.
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
  // REGRA DE NEGÓCIO — só conta parada quem parou: o servidor deriva esta flag do marcador
  // "Afeta Produção" que o Solicitante (opcionalmente) marcou. Com ela falsa, a máquina
  // seguiu operando e a OS não acumula tempo de parada: `horasParada` vem indefinida e as
  // telas exibem "Não se aplica" em vez de um número.
  afetaProducao: boolean
  dataAbertura: string
  dataInicio?: string
  dataFim?: string
  // Horas já calculadas pelo servidor a partir de dataAbertura/dataInicio/dataFim e do
  // histórico de pausas. Só existem em OS encerrada — e `horasParada` só existe quando
  // `afetaProducao` é verdadeira.
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
  // Quem executou o serviço é quem sabe classificá-lo (ver `tiposDefeito`).
  tipoDefeito: TipoDefeito
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
}

// Contadores da Home do Solicitante.
export interface ResumoSolicitacoes {
  abertas: number
  emAndamento: number
  concluidas: number
}
