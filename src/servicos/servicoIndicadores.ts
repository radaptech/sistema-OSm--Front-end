import { atrasoSimulado } from './atrasoSimulado'
import { gerarIndicadoresMockPorMaquina } from './dadosMockIndicadores'

function obterIndicadoresMock(maquinaId: string) {
  return atrasoSimulado(gerarIndicadoresMockPorMaquina(maquinaId))
}

export const servicoIndicadores = {
  obterPorMaquina: obterIndicadoresMock,
}
