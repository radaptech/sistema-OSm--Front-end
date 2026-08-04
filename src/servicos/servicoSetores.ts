import { atrasoSimulado } from './atrasoSimulado'
import { SETORES_MOCK } from './dadosMockSetores'
import type { AtualizarSetorPayload, NovoSetorPayload, SetorCadastrado } from '../tipos/setor'

export interface ParametrosListagemSetores {
  lojaId?: string
}

let proximoId = SETORES_MOCK.length + 1

function listar(parametros: ParametrosListagemSetores = {}) {
  const filtrados = SETORES_MOCK.filter(
    (setor) => !parametros.lojaId || setor.lojaId === parametros.lojaId,
  )

  return atrasoSimulado(filtrados)
}

function criar(dados: NovoSetorPayload): Promise<SetorCadastrado> {
  const setor: SetorCadastrado = { id: `setor-novo-${proximoId++}`, ...dados }
  SETORES_MOCK.push(setor)

  return atrasoSimulado(setor)
}

function atualizar({ id, ...dados }: AtualizarSetorPayload): Promise<SetorCadastrado | undefined> {
  const setor = SETORES_MOCK.find((item) => item.id === id)

  if (setor) {
    Object.assign(setor, dados)
  }

  return atrasoSimulado(setor)
}

function deletar(id: string): Promise<void> {
  const indice = SETORES_MOCK.findIndex((item) => item.id === id)

  if (indice !== -1) {
    SETORES_MOCK.splice(indice, 1)
  }

  return atrasoSimulado(undefined)
}

function obterPorId(id: string): Promise<SetorCadastrado | undefined> {
  return atrasoSimulado(SETORES_MOCK.find((item) => item.id === id))
}

export const servicoSetores = {
  listar,
  obterPorId,
  criar,
  atualizar,
  deletar,
}
