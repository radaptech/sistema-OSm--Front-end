import type { PerfilLogin } from './autenticacao'
import type { Setor } from './maquina'
import type { AreaTecnico } from './tecnico'

export interface NovoUsuarioPayload {
  nome: string
  telefone?: string
  email: string
  senha: string
  role: PerfilLogin
  lojasIds: string[]
  setores: Setor[]
  acessoTotalSetores: boolean
  area?: AreaTecnico
  valorHora?: number
}

// Usuario cobre solicitante, gestor e administrador — técnico tem seu próprio
// registro em Tecnico (área, lojas e valorHora não fazem sentido para os demais perfis).
export interface Usuario {
  id: string
  nome: string
  telefone?: string
  email: string
  role: Exclude<PerfilLogin, 'tecnico'>
  lojasIds: string[]
  setores: Setor[]
  acessoTotalSetores: boolean
}

export interface AtualizarUsuarioPayload extends NovoUsuarioPayload {
  id: string
}
