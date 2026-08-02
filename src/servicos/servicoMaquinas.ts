import { api } from './api'
import { atrasoSimulado } from './atrasoSimulado'
import { MAQUINAS_MOCK } from './dadosMockMaquinas'
import type { NovaMaquinaPayload } from '../tipos/maquina'

export interface ParametrosListagemMaquinas {
  setor?: string
  lojaId?: string
}

function listarMock(parametros: ParametrosListagemMaquinas = {}) {
  const filtradas = MAQUINAS_MOCK.filter((maquina) => {
    const combinaSetor = !parametros.setor || maquina.setor === parametros.setor
    const combinaLoja = !parametros.lojaId || maquina.lojaId === parametros.lojaId

    return combinaSetor && combinaLoja
  })

  return atrasoSimulado(filtradas)
}

function construirFormDataMaquina(
  dados: NovaMaquinaPayload,
  foto?: File,
): FormData {
  const formData = new FormData()

  formData.append('tag', dados.tag)
  formData.append('nome', dados.nome)
  formData.append('descricao', dados.descricao ?? '')
  formData.append('marca', dados.marca ?? '')
  formData.append('modelo', dados.modelo ?? '')
  formData.append('criticidade', dados.criticidade)
  formData.append('setor', dados.setor)
  formData.append('lojaId', dados.lojaId)
  formData.append('preventivas', JSON.stringify(dados.preventivas))

  if (foto) {
    formData.append('foto', foto)
  }

  return formData
}

export const servicoMaquinas = {
  listar: listarMock,

  cadastrar: (dados: NovaMaquinaPayload, foto?: File) =>
    api.post('/maquinas', construirFormDataMaquina(dados, foto)),
}
