import { api } from './api'
import { montarMultipart } from './montarMultipart'
import type { NovaSolicitacaoOSTerceirosPayload } from '../tipos/osTerceiros'
import type { SolicitacaoOS } from '../tipos/ordemServico'

export const servicoOSTerceiros = {
  criar: (
    dados: NovaSolicitacaoOSTerceirosPayload,
    fotoDefeito: File,
    videoDefeito?: File,
  ) =>
    api.post<SolicitacaoOS>(
      '/solicitacoes/terceiros',
      montarMultipart(dados, { foto: fotoDefeito, video: videoDefeito }),
    ),
}
