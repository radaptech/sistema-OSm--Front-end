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
