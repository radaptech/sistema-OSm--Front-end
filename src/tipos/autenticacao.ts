export const perfisLogin = ['solicitante', 'tecnico', 'gestor', 'administrador'] as const

export type PerfilLogin = (typeof perfisLogin)[number]

// setoresIds: 'todos' = acesso a todos os setores da loja; number[] = acesso restrito aos
// setores cadastrados cujos ids estão na lista.
export interface EscopoAcessoGestor {
  lojaId: number
  setoresIds: number[] | 'todos'
}

export interface CredenciaisLogin {
  perfil: PerfilLogin
  email: string
  senha: string
}

// Payload devolvido por POST /autenticacao/login e por GET /autenticacao/sessao.
// É ele que carrega o escopo de acesso do usuário — o front não deriva nada disso.
export interface SessaoUsuario {
  id: number
  nome: string
  email: string
  perfil: PerfilLogin
  // Solicitante: loja e setor onde atua. Demais perfis: nulos.
  lojaId: number | null
  setorId: number | null
  setorNome: string | null
  // Gestor: escopos de Loja/Setor. Demais perfis: nulo.
  escoposGestor: EscopoAcessoGestor[] | null
  // Técnico: id usado para filtrar as OS do painel. Demais perfis: nulo.
  tecnicoId: number | null
}

