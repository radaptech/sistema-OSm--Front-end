import { z } from 'zod'

export const esquemaCadastrarLoja = z.object({
  nome: z.string().min(1, 'Informe o nome da loja.').max(60),
  empresaId: z.string().min(1, 'Selecione a empresa.'),
})

export type DadosCadastrarLoja = z.infer<typeof esquemaCadastrarLoja>
