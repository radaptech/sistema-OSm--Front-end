export interface Loja {
  id: string
  nome: string
  empresaId: string
}

export interface NovaLojaPayload {
  nome: string
  empresaId: string
}
