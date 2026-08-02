import { z } from 'zod'
import { niveisUrgencia } from '../../tipos/ordemServico'

export const esquemaAbrirOrdemServico = z.object({
  urgencia: z.enum(niveisUrgencia, 'Selecione o nível de urgência.'),
  tecnicoId: z.string().min(1, 'Selecione o técnico responsável.'),
})

export type DadosAbrirOrdemServico = z.infer<typeof esquemaAbrirOrdemServico>

export interface DadosConfirmarAberturaOS extends DadosAbrirOrdemServico {
  dataHora: string
}
