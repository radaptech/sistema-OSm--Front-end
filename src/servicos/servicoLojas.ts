import { atrasoSimulado } from './atrasoSimulado'
import { LOJAS_MOCK } from './dadosMockLojas'
import type { Loja, NovaLojaPayload } from '../tipos/loja'

let proximoId = LOJAS_MOCK.length + 1

function criar(dados: NovaLojaPayload): Promise<Loja> {
  const loja: Loja = { id: `loja-${proximoId++}`, ...dados }
  LOJAS_MOCK.push(loja)

  return atrasoSimulado(loja)
}

export const servicoLojas = {
  listar: () => atrasoSimulado(LOJAS_MOCK),
  criar,
}
