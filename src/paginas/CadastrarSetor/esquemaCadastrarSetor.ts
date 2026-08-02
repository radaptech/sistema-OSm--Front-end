import { z } from 'zod'

export const esquemaCadastrarSetor = z.object({
  nome: z.string().min(1, 'Informe o nome do setor.').max(60),
  lojaId: z.string().min(1, 'Selecione a loja.'),
})

export type DadosCadastrarSetor = z.infer<typeof esquemaCadastrarSetor>
