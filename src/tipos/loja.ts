export interface Loja {
  id: number
  nome: string
  empresaId: number
  ativa?: boolean
}

export interface NovaLojaPayload {
  nome: string
  empresaId: number
}

export interface AtualizarLojaPayload extends NovaLojaPayload {
  id: number
}
