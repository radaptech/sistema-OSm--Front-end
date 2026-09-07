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
  // Declarado pelo Técnico no encerramento, corrigível aqui pelo Administrador: é ele
  // que liga os dois campos abaixo. Desmarcado, o servidor exige número e série nulos.
  temNotaFiscal: z.boolean(),
  // Nota fiscal vale em qualquer tipo de OS: é o documento que embasa o Custo de
  // Manutenção lançado — a fatura da empresa em terceiros, a nota da peça em maquinário,
  // a do material em reparo. Opcional em todos (nem toda OS teve compra).
  numeroNotaFiscal: z
    .string()
    .max(20, 'Informe até 20 caracteres.')
    .optional(),
  serieNotaFiscal: z
    .string()
    .max(10, 'Informe até 10 caracteres.')
    .optional(),
  descricaoServicoTerceiro: z
    .string()
    .max(300, 'A descrição deve ter no máximo 300 caracteres.')
    .optional(),
})

export type DadosLancarCustoManutencao = z.infer<
  typeof esquemaLancarCustoManutencao
>
