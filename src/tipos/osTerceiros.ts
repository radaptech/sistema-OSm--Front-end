import type { TipoDefeito } from './ordemServico'

// Solicitação de OS para reparo por empresa terceirizada — diferente da OS de
// Maquinário (item 3), o atendimento não é feito pelos técnicos internos: a máquina é
// enviada a uma empresa terceirizada especializada (ex: assistência técnica de balanças).
// A empresa terceirizada responsável NÃO é escolhida aqui pelo Solicitante — é definida
// pelo Gestor no momento da aprovação (ver ModalAprovarOSTerceiros, item 6).
export interface NovaSolicitacaoOSTerceirosPayload {
  maquinaId: string
  maquinaNome: string
  tipoDefeito: TipoDefeito
  descricao: string
  setor: string
  lojaId: string
  solicitante: string
  dataHora: string
}
