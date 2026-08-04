import { api } from './api'
import type { NovaSolicitacaoReparoPayload } from '../tipos/reparo'

function construirFormDataReparo(
  dados: NovaSolicitacaoReparoPayload,
  foto?: File,
): FormData {
  const formData = new FormData()

  formData.append('item', dados.item)
  formData.append('descricao', dados.descricao)
  formData.append('setor', dados.setor)
  formData.append('lojaId', dados.lojaId)
  formData.append('solicitante', dados.solicitante)
  formData.append('dataHora', dados.dataHora)

  if (foto) {
    formData.append('foto', foto)
  }

  return formData
}

export const servicoReparos = {
  criar: (dados: NovaSolicitacaoReparoPayload, foto?: File) =>
    api.post('/solicitacoes-reparo', construirFormDataReparo(dados, foto)),
}
