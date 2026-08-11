import { z } from 'zod'

export const esquemaNovaSolicitacaoReparo = z.object({
  item: z.string().min(1, 'Informe o item que precisa de reparo.').max(100),
  descricao: z
    .string()
    .min(10, 'Descreva o problema com no mínimo 10 caracteres.')
    .max(500, 'A descrição deve ter no máximo 500 caracteres.'),
})

export type DadosNovaSolicitacaoReparo = z.infer<typeof esquemaNovaSolicitacaoReparo>
