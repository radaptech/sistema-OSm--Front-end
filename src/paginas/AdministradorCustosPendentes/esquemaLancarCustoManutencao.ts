import { z } from 'zod'

export const esquemaLancarCustoManutencao = z.object({
  custoManutencao: z
    .number('Informe o custo de manutenção.')
    .nonnegative('O custo não pode ser negativo.')
    .max(999999, 'Informe um valor de até R$ 999.999.'),
})

export type DadosLancarCustoManutencao = z.infer<typeof esquemaLancarCustoManutencao>
