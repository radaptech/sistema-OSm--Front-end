import { z } from 'zod'

export const esquemaPausarOrdemServico = z.object({
  motivoPausa: z
    .string()
    .min(5, 'Descreva o motivo da pausa (ex: aguardando peça).')
    .max(300, 'O motivo deve ter no máximo 300 caracteres.'),
})

export type DadosPausarOrdemServico = z.infer<typeof esquemaPausarOrdemServico>
