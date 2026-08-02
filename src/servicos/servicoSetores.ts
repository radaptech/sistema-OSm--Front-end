import { atrasoSimulado } from './atrasoSimulado'
import { SETORES_MOCK } from './dadosMockSetores'
import type { NovoSetorPayload, SetorCadastrado } from '../tipos/setor'

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

export const servicoSetores = {
  listar,
  criar,
}
