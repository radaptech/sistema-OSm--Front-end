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
}
