import { atrasoSimulado } from './atrasoSimulado'
import { PREVENTIVAS_MOCK } from './dadosMockPreventivas'

export const servicoPreventivas = {
  listar: () => atrasoSimulado(PREVENTIVAS_MOCK),
}
