import { z } from 'zod'
import { perfisLogin } from '../../tipos/autenticacao'

export const esquemaLogin = z.object({
  perfil: z.enum(perfisLogin),
  email: z.email('Informe um e-mail válido.'),
  senha: z
    .string()
    .min(1, 'Informe a senha.')
    .min(6, 'A senha deve ter no mínimo 6 caracteres.'),
})

export type DadosLogin = z.infer<typeof esquemaLogin>
