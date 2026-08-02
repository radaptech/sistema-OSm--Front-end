import { atrasoSimulado } from './atrasoSimulado'
import { EMPRESAS_MOCK } from './dadosMockEmpresas'

export const servicoEmpresas = {
  listar: () => atrasoSimulado(EMPRESAS_MOCK),
}
