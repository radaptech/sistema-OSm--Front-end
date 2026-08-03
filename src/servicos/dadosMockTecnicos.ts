import type { Tecnico } from '../tipos/tecnico'

export const TECNICOS_MOCK: Tecnico[] = [
  { id: 'tecnico-1', nome: 'Roberto Alves', area: 'Refrigeração', lojasIds: ['loja-1'] },
  {
    id: 'tecnico-2',
    nome: 'Fernanda Souza',
    area: 'Elétrica',
    lojasIds: ['loja-1', 'loja-2'],
  },
  {
    id: 'tecnico-3',
    nome: 'João Pereira',
    area: 'Máquinas em Geral',
    lojasIds: ['loja-2', 'loja-3'],
  },
]

const TECNICO_POR_LOGIN_MOCK: Record<string, string> = {
  roberto: 'tecnico-1',
  fernanda: 'tecnico-2',
  joao: 'tecnico-3',
}

const TECNICO_PADRAO_MOCK = 'tecnico-1'

// Placeholder para o login mockado (sem back-end ainda).
// Em produção, o back-end deve retornar o tecnicoId do usuário autenticado no payload de login.
export function obterTecnicoLogadoMock(email: string): string {
  const parteLocal = email.split('@')[0]?.toLowerCase() ?? ''

  return TECNICO_POR_LOGIN_MOCK[parteLocal] ?? TECNICO_PADRAO_MOCK
}
