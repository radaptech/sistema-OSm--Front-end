import { api } from './api'
import { atrasoSimulado } from './atrasoSimulado'
import { MAQUINAS_MOCK } from './dadosMockMaquinas'
import type { NovaMaquinaPayload } from '../tipos/maquina'

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
  formData.append('preventivas', JSON.stringify(dados.preventivas))

  if (foto) {
    formData.append('foto', foto)
  }

  return formData
}

export const servicoMaquinas = {
  listar: () => atrasoSimulado(MAQUINAS_MOCK),

  cadastrar: (dados: NovaMaquinaPayload, foto?: File) =>
    api.post('/maquinas', construirFormDataMaquina(dados, foto)),
}
