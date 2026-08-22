export interface Loja {
  id: number
  nome: string
  empresaId: number
  ativa?: boolean
}

// Sem empresaId: empresa É o tenant, que o servidor tira do token. O campo
// existe na Loja de leitura (é o tenant_id da linha), mas nunca no envio.
export interface NovaLojaPayload {
  nome: string
}

export interface AtualizarLojaPayload extends NovaLojaPayload {
  id: number
}
