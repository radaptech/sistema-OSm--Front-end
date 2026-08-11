export interface SetorCadastrado {
  id: number
  nome: string
  lojaId: number
  ativo?: boolean
}

export interface NovoSetorPayload {
  nome: string
  lojaId: number
}

export interface AtualizarSetorPayload extends NovoSetorPayload {
  id: number
}
