import type { Setor } from '../tipos/maquina'

interface SetorSolicitante {
  lojaId: string
  setor: Setor
}

const SETOR_POR_SOLICITANTE_MOCK: Record<string, SetorSolicitante> = {
  ronald: { lojaId: 'loja-1', setor: 'Açougue' },
  eduardo: { lojaId: 'loja-1', setor: 'Padaria' },
  marina: { lojaId: 'loja-2', setor: 'Frios e Laticínios' },
  carlos: { lojaId: 'loja-2', setor: 'Estoque' },
}

const SETOR_PADRAO_MOCK: SetorSolicitante = { lojaId: 'loja-1', setor: 'Padaria' }

// Placeholder para o login mockado (sem back-end ainda).
// Em produção, o back-end deve retornar a loja e o setor do usuário autenticado no payload de login.
export function obterSetorSolicitanteMock(email: string): SetorSolicitante {
  const parteLocal = email.split('@')[0]?.toLowerCase() ?? ''

  return SETOR_POR_SOLICITANTE_MOCK[parteLocal] ?? SETOR_PADRAO_MOCK
}
