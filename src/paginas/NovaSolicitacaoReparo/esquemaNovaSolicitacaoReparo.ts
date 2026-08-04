import { z } from 'zod'
import { setoresDisponiveis } from '../../tipos/maquina'

export const esquemaNovaSolicitacaoReparo = z.object({
  item: z.string().min(1, 'Informe o item que precisa de reparo.').max(100),
  descricao: z
    .string()
    .min(10, 'Descreva o problema com no mínimo 10 caracteres.')
    .max(500, 'A descrição deve ter no máximo 500 caracteres.'),
  setor: z.enum(setoresDisponiveis, 'Setor não identificado.'),
  lojaId: z.string().min(1, 'Loja não identificada.'),
  solicitante: z.string().min(1),
  dataHora: z.string().min(1),
})

export type DadosNovaSolicitacaoReparo = z.infer<typeof esquemaNovaSolicitacaoReparo>
