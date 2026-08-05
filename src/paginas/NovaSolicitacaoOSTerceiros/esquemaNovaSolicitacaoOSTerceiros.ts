import { z } from 'zod'
import { tiposDefeito } from '../../tipos/ordemServico'

export const esquemaNovaSolicitacaoOSTerceiros = z.object({
  maquinaId: z.string().min(1, 'Selecione uma máquina.'),
  maquinaNome: z.string().min(1, 'Selecione uma máquina para preencher o nome.'),
  tipoDefeito: z.enum(tiposDefeito, 'Selecione o tipo de defeito.'),
  setor: z.string().min(1, 'Selecione uma máquina para preencher o setor.'),
  lojaId: z.string().min(1, 'Selecione uma máquina para preencher a loja.'),
  solicitante: z.string().min(1),
  descricao: z
    .string()
    .min(20, 'Descreva o problema com no mínimo 20 caracteres.')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres.'),
  dataHora: z.string().min(1),
})

export type DadosNovaSolicitacaoOSTerceiros = z.infer<
  typeof esquemaNovaSolicitacaoOSTerceiros
>
