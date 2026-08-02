import { tiposDefeito } from '../tipos/ordemServico'
import type { IndicadoresMaquina } from '../tipos/indicadorMaquina'

const NOMES_MES = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

const MESES_HISTORICO = 6
const DATA_REFERENCIA = new Date('2026-08-01T00:00:00')

function criarGeradorPseudoAleatorio(semente: string) {
  let estado = 0
  for (let indice = 0; indice < semente.length; indice += 1) {
    estado = (estado * 31 + semente.charCodeAt(indice)) >>> 0
  }

  return function proximoValor(): number {
    estado = (estado * 1664525 + 1013904223) >>> 0
    return estado / 0xffffffff
  }
}

function gerarUltimosMeses(quantidade: number): string[] {
  const meses: string[] = []

  for (let indice = quantidade - 1; indice >= 0; indice -= 1) {
    const data = new Date(DATA_REFERENCIA)
    data.setMonth(data.getMonth() - indice)
    meses.push(
      `${NOMES_MES[data.getMonth()]}/${String(data.getFullYear()).slice(2)}`,
    )
  }

  return meses
}

export function gerarIndicadoresMockPorMaquina(
  maquinaId: string,
): IndicadoresMaquina {
  const proximoValor = criarGeradorPseudoAleatorio(maquinaId)

  const porTipoDefeito = tiposDefeito
    .map((tipoDefeito) => ({
      tipoDefeito,
      horasParada: Math.round(
        proximoValor() * 40 * (proximoValor() > 0.25 ? 1 : 0),
      ),
    }))
    .filter((item) => item.horasParada > 0)

  const horasParadaTotal = porTipoDefeito.reduce(
    (total, item) => total + item.horasParada,
    0,
  )

  const porMes = gerarUltimosMeses(MESES_HISTORICO).map((mes) => ({
    mes,
    custoTotal: Math.round(600 + proximoValor() * 5400),
  }))

  const custoTotal = porMes.reduce((total, item) => total + item.custoTotal, 0)
  const numeroOcorrencias = Math.max(porTipoDefeito.length, 1)

  return {
    maquinaId,
    horasParadaTotal,
    mttrHoras:
      Math.round((horasParadaTotal / numeroOcorrencias) * 10) / 10 || 1.5,
    mtbfHoras: Math.round(120 + proximoValor() * 260),
    custoTotal,
    porTipoDefeito,
    porMes,
  }
}
