import type { EscopoAcessoGestor } from '../tipos/autenticacao'

// Placeholder para o login mockado (sem back-end ainda).
// Em produção, o back-end deve retornar os escoposGestor do usuário autenticado no payload de login.
export const ESCOPO_GESTOR_MOCK: EscopoAcessoGestor[] = [
  { lojaId: 'loja-1', setores: ['Padaria', 'Açougue'] },
]
