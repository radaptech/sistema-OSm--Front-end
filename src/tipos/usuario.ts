import type { PerfilLogin } from './autenticacao'
import type { AreaTecnico } from './tecnico'

export interface NovoUsuarioPayload {
  nome: string
  telefone?: string
  email: string
  senha: string
  perfil: PerfilLogin
  lojasIds: number[]
  // Ids dos setores cadastrados (ver /src/tipos/setor.ts) — ignorados pelo servidor
  // quando perfil é 'tecnico' ou 'administrador'.
  setoresIds: number[]
  acessoTotalSetores: boolean
  area?: AreaTecnico
}

// Usuario cobre solicitante, gestor e administrador — técnico tem seu próprio
// registro em Tecnico (área e lojas não fazem sentido para os demais perfis).
export interface Usuario {
  id: number
  nome: string
  telefone?: string
  email: string
  perfil: Exclude<PerfilLogin, 'tecnico'>
  lojasIds: number[]
  setoresIds: number[]
  acessoTotalSetores: boolean
  ativo?: boolean
}

// A senha só é enviada quando o Administrador quiser trocá-la; omitida, o servidor mantém
// o hash atual.
export interface AtualizarUsuarioPayload extends Omit<NovoUsuarioPayload, 'senha'> {
  id: number
  senha?: string
}
