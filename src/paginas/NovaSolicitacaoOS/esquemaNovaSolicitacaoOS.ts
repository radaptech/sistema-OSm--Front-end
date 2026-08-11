import { z } from 'zod'
import { marcadoresImpacto, tiposDefeito } from '../../tipos/ordemServico'

// Setor, loja, solicitante e data/hora não são enviados: o servidor deriva da máquina
// selecionada e da sessão autenticada.
export const esquemaNovaSolicitacaoOS = z.object({
  maquinaId: z.number('Selecione uma máquina.').int().positive('Selecione uma máquina.'),
  tipoDefeito: z.enum(tiposDefeito, 'Selecione o tipo de defeito.'),
  descricao: z
    .string()
    .min(20, 'Descreva o problema com no mínimo 20 caracteres.')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres.'),
  impactos: z.array(z.enum(marcadoresImpacto)),
})

export type DadosNovaSolicitacaoOS = z.infer<typeof esquemaNovaSolicitacaoOS>
