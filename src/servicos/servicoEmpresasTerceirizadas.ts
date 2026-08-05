import { atrasoSimulado } from './atrasoSimulado'
import { EMPRESAS_TERCEIRIZADAS_MOCK } from './dadosMockEmpresasTerceirizadas'
import type {
  AtualizarEmpresaTerceirizadaPayload,
  EmpresaTerceirizada,
  NovaEmpresaTerceirizadaPayload,
} from '../tipos/empresaTerceirizada'

let proximoId = EMPRESAS_TERCEIRIZADAS_MOCK.length + 1

function criar(dados: NovaEmpresaTerceirizadaPayload): Promise<EmpresaTerceirizada> {
  const empresaTerceirizada: EmpresaTerceirizada = {
    id: `terceirizada-${proximoId++}`,
    ...dados,
  }
  EMPRESAS_TERCEIRIZADAS_MOCK.push(empresaTerceirizada)

  return atrasoSimulado(empresaTerceirizada)
}

function atualizar({
  id,
  ...dados
}: AtualizarEmpresaTerceirizadaPayload): Promise<EmpresaTerceirizada | undefined> {
  const empresaTerceirizada = EMPRESAS_TERCEIRIZADAS_MOCK.find((item) => item.id === id)

  if (empresaTerceirizada) {
    Object.assign(empresaTerceirizada, dados)
  }

  return atrasoSimulado(empresaTerceirizada)
}

function deletar(id: string): Promise<void> {
  const indice = EMPRESAS_TERCEIRIZADAS_MOCK.findIndex((item) => item.id === id)

  if (indice !== -1) {
    EMPRESAS_TERCEIRIZADAS_MOCK.splice(indice, 1)
  }

  return atrasoSimulado(undefined)
}

function obterPorId(id: string): Promise<EmpresaTerceirizada | undefined> {
  return atrasoSimulado(EMPRESAS_TERCEIRIZADAS_MOCK.find((item) => item.id === id))
}

export const servicoEmpresasTerceirizadas = {
  // Copia rasa de cada item: `atualizar` faz Object.assign in-place no objeto original,
  // então devolver a mesma referência de item faria o structuralSharing do React Query
  // considerá-lo "igual" (mesma identidade) e nunca detectar a mudança de campo — daí a
  // UI ficar presa no snapshot antigo depois de invalidateQueries (mesmo ajuste em
  // servicoOrdensServico/servicoSolicitacoes).
  listar: () =>
    atrasoSimulado(EMPRESAS_TERCEIRIZADAS_MOCK.map((empresa) => ({ ...empresa }))),
  obterPorId,
  criar,
  atualizar,
  deletar,
}
