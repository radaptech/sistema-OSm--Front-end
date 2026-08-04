import { z } from 'zod'
import { marcadoresImpacto, tiposDefeito } from '../../tipos/ordemServico'

export const esquemaNovaSolicitacaoOS = z.object({
  maquinaId: z.string().min(1, 'Selecione uma máquina.'),
  tipoDefeito: z.enum(tiposDefeito, 'Selecione o tipo de defeito.'),
  setor: z.string().min(1, 'Selecione uma máquina para preencher o setor.'),
  lojaId: z.string().min(1, 'Selecione uma máquina para preencher a loja.'),
  solicitante: z.string().min(1),
  descricao: z
    .string()
    .min(20, 'Descreva o problema com no mínimo 20 caracteres.')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres.'),
  impactos: z.array(z.enum(marcadoresImpacto)),
  dataHora: z.string().min(1),
})

export type DadosNovaSolicitacaoOS = z.infer<typeof esquemaNovaSolicitacaoOS>
