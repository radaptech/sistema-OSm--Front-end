import { z } from 'zod'

export const esquemaEncerrarOrdemServico = z.object({
  horaEstimada: z
    .number('Informe as horas trabalhadas.')
    .positive('As horas trabalhadas devem ser maiores que zero.')
    .max(999, 'Informe um valor de até 999 horas.'),
  custo: z
    .number('Informe o custo total.')
    .nonnegative('O custo não pode ser negativo.')
    .max(999999, 'Informe um valor de até R$ 999.999.'),
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
