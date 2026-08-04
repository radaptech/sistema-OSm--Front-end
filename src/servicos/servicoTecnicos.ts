import { atrasoSimulado } from './atrasoSimulado'
import { TECNICOS_MOCK } from './dadosMockTecnicos'
import type { AtualizarTecnicoPayload, NovoTecnicoPayload, Tecnico } from '../tipos/tecnico'

export interface ParametrosListagemTecnicos {
  lojaId?: string
}

let proximoId = TECNICOS_MOCK.length + 1

function listar(parametros: ParametrosListagemTecnicos = {}) {
  const filtrados = TECNICOS_MOCK.filter(
    (tecnico) => !parametros.lojaId || tecnico.lojasIds.includes(parametros.lojaId),
  )

  return atrasoSimulado(filtrados)
}

function obterPorId(id: string): Promise<Tecnico | undefined> {
  return atrasoSimulado(TECNICOS_MOCK.find((item) => item.id === id))
}

// Desvio deliberado: assim como servicoOrdensServico, ainda não existe endpoint real
// para o domínio de Técnicos — o CRUD do Administrador precisa funcionar de ponta a
// ponta sem back-end, então opera diretamente sobre o mock (mesmo padrão do item 9/11).
function criar(dados: NovoTecnicoPayload): Promise<Tecnico> {
  const tecnico: Tecnico = { id: `tecnico-${proximoId++}`, ...dados }
  TECNICOS_MOCK.push(tecnico)

  return atrasoSimulado(tecnico)
}

function atualizar({ id, ...dados }: AtualizarTecnicoPayload): Promise<Tecnico | undefined> {
  const tecnico = TECNICOS_MOCK.find((item) => item.id === id)

  if (tecnico) {
    Object.assign(tecnico, dados)
  }

  return atrasoSimulado(tecnico)
}

function deletar(id: string): Promise<void> {
  const indice = TECNICOS_MOCK.findIndex((item) => item.id === id)

  if (indice !== -1) {
    TECNICOS_MOCK.splice(indice, 1)
  }

  return atrasoSimulado(undefined)
}

export const servicoTecnicos = {
  listar,
  obterPorId,
  criar,
  atualizar,
  deletar,
}
