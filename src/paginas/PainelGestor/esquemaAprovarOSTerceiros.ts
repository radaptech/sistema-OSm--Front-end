import { z } from 'zod'

export const esquemaAprovarOSTerceiros = z.object({
  empresaTerceirizadaId: z
    .number('Selecione a empresa terceirizada.')
    .int()
    .positive('Selecione a empresa terceirizada.'),
})

export type DadosAprovarOSTerceiros = z.infer<typeof esquemaAprovarOSTerceiros>
