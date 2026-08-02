import type { EscopoAcessoGestor } from '../tipos/autenticacao'

const ESCOPOS_POR_GESTOR_MOCK: Record<string, EscopoAcessoGestor[]> = {
  gestor1: [{ lojaId: 'loja-1', setores: ['Padaria', 'Açougue'] }],
  gestor2: [{ lojaId: 'loja-1', setores: ['Hortifruti', 'Peixaria'] }],
  regional: [
    { lojaId: 'loja-2', setores: 'todos' },
    { lojaId: 'loja-3', setores: 'todos' },
  ],
}

const ESCOPO_PADRAO_MOCK: EscopoAcessoGestor[] = ESCOPOS_POR_GESTOR_MOCK.gestor1

// Placeholder para o login mockado (sem back-end ainda).
// Em produção, o back-end deve retornar os escoposGestor do usuário autenticado no payload de login.
export function obterEscoposGestorMock(email: string): EscopoAcessoGestor[] {
  const parteLocal = email.split('@')[0]?.toLowerCase() ?? ''

  return ESCOPOS_POR_GESTOR_MOCK[parteLocal] ?? ESCOPO_PADRAO_MOCK
}
