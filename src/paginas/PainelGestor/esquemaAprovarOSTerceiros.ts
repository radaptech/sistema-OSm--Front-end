import { z } from 'zod'

export const esquemaAprovarOSTerceiros = z.object({
  empresaTerceirizadaId: z.string().min(1, 'Selecione a empresa terceirizada.'),
})

export type DadosAprovarOSTerceiros = z.infer<typeof esquemaAprovarOSTerceiros>

export interface DadosConfirmarAprovacaoTerceiros extends DadosAprovarOSTerceiros {
  dataHora: string
}
