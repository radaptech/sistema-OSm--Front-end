import type { Tecnico } from '../tipos/tecnico'

export const TECNICOS_MOCK: Tecnico[] = [
  {
    id: 'tecnico-1',
    nome: 'Roberto Alves',
    email: 'roberto@cooprata.com.br',
    area: 'Refrigeração',
    lojasIds: ['loja-1'],
    valorHora: 45,
  },
  {
    id: 'tecnico-2',
    nome: 'Fernanda Souza',
    email: 'fernanda@cooprata.com.br',
    area: 'Elétrica',
    lojasIds: ['loja-1', 'loja-2'],
    valorHora: 50,
  },
  {
    id: 'tecnico-3',
    nome: 'João Pereira',
    email: 'joao@cooprata.com.br',
    area: 'Máquinas em Geral',
    lojasIds: ['loja-2', 'loja-3'],
    valorHora: 40,
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
