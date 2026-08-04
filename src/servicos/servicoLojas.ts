import { atrasoSimulado } from './atrasoSimulado'
import { LOJAS_MOCK } from './dadosMockLojas'
import type { AtualizarLojaPayload, Loja, NovaLojaPayload } from '../tipos/loja'

let proximoId = LOJAS_MOCK.length + 1

function criar(dados: NovaLojaPayload): Promise<Loja> {
  const loja: Loja = { id: `loja-${proximoId++}`, ...dados }
  LOJAS_MOCK.push(loja)

  return atrasoSimulado(loja)
}

function atualizar({ id, ...dados }: AtualizarLojaPayload): Promise<Loja | undefined> {
  const loja = LOJAS_MOCK.find((item) => item.id === id)

  if (loja) {
    Object.assign(loja, dados)
  }

  return atrasoSimulado(loja)
}

function deletar(id: string): Promise<void> {
  const indice = LOJAS_MOCK.findIndex((item) => item.id === id)

  if (indice !== -1) {
    LOJAS_MOCK.splice(indice, 1)
  }

  return atrasoSimulado(undefined)
}

function obterPorId(id: string): Promise<Loja | undefined> {
  return atrasoSimulado(LOJAS_MOCK.find((item) => item.id === id))
}

export const servicoLojas = {
  listar: () => atrasoSimulado(LOJAS_MOCK),
  obterPorId,
  criar,
  atualizar,
  deletar,
}
