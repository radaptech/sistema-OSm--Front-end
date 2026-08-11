import { z } from 'zod'

// Toda OS passa pelo Técnico — inclusive a que ele encaminhou para uma empresa externa —
// então os dois custos já chegam preenchidos do encerramento (item 11 do CLAUDE.md). Aqui
// o Administrador só corrige, tipicamente o Custo de Manutenção contra a nota fiscal.
export const esquemaLancarCustoManutencao = z.object({
  custoHoraTecnico: z
    .number()
    .nonnegative('O custo não pode ser negativo.')
    .max(999999, 'Informe um valor de até R$ 999.999.')
    .optional(),
  custoManutencao: z
    .number('Informe o custo de manutenção.')
    .nonnegative('O custo não pode ser negativo.')
    .max(999999, 'Informe um valor de até R$ 999.999.'),
})

export type DadosLancarCustoManutencao = z.infer<
  typeof esquemaLancarCustoManutencao
>
