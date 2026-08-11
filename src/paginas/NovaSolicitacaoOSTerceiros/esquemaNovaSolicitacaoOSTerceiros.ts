import { z } from 'zod'
import { tiposDefeito } from '../../tipos/ordemServico'

export const esquemaNovaSolicitacaoOSTerceiros = z.object({
  maquinaId: z.number('Selecione uma máquina.').int().positive('Selecione uma máquina.'),
  tipoDefeito: z.enum(tiposDefeito, 'Selecione o tipo de defeito.'),
  descricao: z
    .string()
    .min(20, 'Descreva o problema com no mínimo 20 caracteres.')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres.'),
})

export type DadosNovaSolicitacaoOSTerceiros = z.infer<
  typeof esquemaNovaSolicitacaoOSTerceiros
>
