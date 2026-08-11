import { z } from 'zod'

export const esquemaCadastrarLoja = z.object({
  nome: z.string().min(1, 'Informe o nome da loja.').max(60),
  // O <select> devolve string; o back-end espera id numérico.
  empresaId: z.number('Selecione a empresa.').int().positive('Selecione a empresa.'),
})

export type DadosCadastrarLoja = z.infer<typeof esquemaCadastrarLoja>
