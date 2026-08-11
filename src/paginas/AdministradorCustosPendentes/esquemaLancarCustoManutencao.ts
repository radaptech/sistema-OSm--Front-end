import { z } from 'zod'

// A Descrição só é obrigatória para OS Terceiros — ela não passa pelo Técnico
// (ModalEncerrarOrdemServico, item 11 do CLAUDE.md), então é aqui que fica registrado o
// que a empresa terceirizada efetivamente fez, sem depender de defeitoConstatado/
// causaRaiz/solucao já preenchidos.
export function criarEsquemaLancarCustoManutencao(ehTerceiros: boolean) {
  return z.object({
    custoHoraTecnico: z
      .number()
      .nonnegative('O custo não pode ser negativo.')
      .max(999999, 'Informe um valor de até R$ 999.999.')
      .optional(),
    custoManutencao: z
      .number('Informe o custo de manutenção.')
      .nonnegative('O custo não pode ser negativo.')
      .max(999999, 'Informe um valor de até R$ 999.999.'),
    descricaoServico: ehTerceiros
      ? z
          .string()
          .min(10, 'Descreva o que foi feito pela empresa terceirizada.')
          .max(500, 'A descrição deve ter no máximo 500 caracteres.')
      : z
          .string()
          .max(500, 'A descrição deve ter no máximo 500 caracteres.')
          .optional(),
  })
}

export type DadosLancarCustoManutencao = z.infer<
  ReturnType<typeof criarEsquemaLancarCustoManutencao>
>
