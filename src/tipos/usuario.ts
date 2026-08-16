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

// Usuario cobre os quatro perfis, inclusive Técnico: /usuarios é a superfície
// única de escrita (ver CLAUDE.md item 7), então GET /usuarios devolve a tabela
// inteira. Tecnico (/src/tipos/tecnico.ts) é a projeção somente-leitura com
// área de atuação, consumida por GET /tecnicos — não é um recorte diferente de
// gente, é um recorte diferente de campos.
export interface Usuario {
  id: number
  nome: string
  telefone?: string
  email: string
  perfil: PerfilLogin
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
