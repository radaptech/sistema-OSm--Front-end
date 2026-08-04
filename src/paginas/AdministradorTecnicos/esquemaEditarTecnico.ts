import { z } from 'zod'
import { areasTecnico } from '../../tipos/tecnico'

export const esquemaEditarTecnico = z.object({
  nome: z.string().min(1, 'Informe o nome.').max(100),
  email: z.email('Informe um e-mail válido.'),
  telefone: z.string().max(20).optional(),
  area: z.enum(areasTecnico, 'Selecione a área de atuação.'),
  lojasIds: z.array(z.string()).min(1, 'Selecione ao menos uma loja.'),
  valorHora: z.number('Informe o valor/hora.').positive('Informe um valor/hora válido.'),
})

export type DadosEditarTecnico = z.infer<typeof esquemaEditarTecnico>
