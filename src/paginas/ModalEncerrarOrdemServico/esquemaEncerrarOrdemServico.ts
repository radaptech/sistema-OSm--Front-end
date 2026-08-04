import { z } from 'zod'

export const esquemaEncerrarOrdemServico = z.object({
  defeitoConstatado: z
    .string()
    .min(10, 'Descreva o defeito constatado.')
    .max(500, 'A descrição deve ter no máximo 500 caracteres.'),
  causaRaiz: z
    .string()
    .min(10, 'Descreva a causa raiz identificada.')
    .max(500, 'A descrição deve ter no máximo 500 caracteres.'),
  solucao: z
    .string()
    .min(10, 'Descreva a solução aplicada.')
    .max(500, 'A descrição deve ter no máximo 500 caracteres.'),
})

export type DadosEncerrarOrdemServico = z.infer<typeof esquemaEncerrarOrdemServico>
