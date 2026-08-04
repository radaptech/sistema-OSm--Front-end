import type { Setor } from './maquina'

// Solicitação de pequeno reparo (lâmpada, vidro, piso, etc.) — diferente da OS de
// Maquinário, não exige cadastro prévio de um item no banco de dados: o Solicitante
// descreve o item na hora, sem precisar selecioná-lo de uma lista.
export interface NovaSolicitacaoReparoPayload {
  item: string
  descricao: string
  setor: Setor
  lojaId: string
  solicitante: string
  dataHora: string
}
