import type { TipoDefeito } from './ordemServico'

// Solicitação de OS para reparo por empresa terceirizada — parte de uma máquina já
// cadastrada, mas o atendimento não é feito pelos técnicos internos.
// A empresa terceirizada responsável NÃO é escolhida aqui: quem define é o Gestor, no
// momento da aprovação (ModalAprovarOSTerceiros).
export interface NovaSolicitacaoOSTerceirosPayload {
  maquinaId: number
  tipoDefeito: TipoDefeito
  descricao: string
}
