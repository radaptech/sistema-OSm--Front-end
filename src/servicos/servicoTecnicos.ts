import { atrasoSimulado } from './atrasoSimulado'
import { TECNICOS_MOCK } from './dadosMockTecnicos'

export interface ParametrosListagemTecnicos {
  lojaId?: string
}

function listar(parametros: ParametrosListagemTecnicos = {}) {
  const filtrados = TECNICOS_MOCK.filter(
    (tecnico) => !parametros.lojaId || tecnico.lojasIds.includes(parametros.lojaId),
  )

  return atrasoSimulado(filtrados)
}

export const servicoTecnicos = {
  listar,
}
