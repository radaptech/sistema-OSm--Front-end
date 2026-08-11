import { z } from 'zod'
import { tiposDefeito } from '../../tipos/ordemServico'

export const esquemaEncerrarOrdemServico = z.object({
  // Classificação da OS: quem executou o serviço é quem sabe dizer se foi Predial ou
  // Corretiva — o Solicitante não escolhe isso ao abrir o pedido.
  tipoDefeito: z.enum(tiposDefeito, 'Selecione o tipo de OS.'),
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
  custoHoraTecnico: z
    .number('Informe o custo hora do técnico.')
    .nonnegative('O custo não pode ser negativo.')
    .max(999999, 'Informe um valor de até R$ 999.999.'),
  custoManutencao: z
    .number('Informe o custo de manutenção.')
    .nonnegative('O custo não pode ser negativo.')
    .max(999999, 'Informe um valor de até R$ 999.999.'),
})

export type DadosEncerrarOrdemServico = z.infer<
  typeof esquemaEncerrarOrdemServico
>
