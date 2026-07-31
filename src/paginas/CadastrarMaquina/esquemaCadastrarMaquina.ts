import { z } from 'zod'
import { niveisCriticidade, setoresDisponiveis } from '../../tipos/maquina'
import { esquemaManutencaoPreventiva } from '../ModalManutencaoPreventiva/esquemaManutencaoPreventiva'

export const esquemaCadastrarMaquina = z.object({
  tag: z.string().min(1, 'Informe a tag da máquina.').max(50),
  nome: z.string().min(1, 'Informe o nome da máquina.').max(100),
  descricao: z
    .string()
    .max(500, 'A descrição deve ter no máximo 500 caracteres.')
    .optional(),
  marca: z.string().max(60).optional(),
  modelo: z.string().max(60).optional(),
  criticidade: z.enum(niveisCriticidade, 'Selecione a criticidade.'),
  setor: z.enum(setoresDisponiveis, 'Selecione o setor.'),
  preventivas: z
    .array(esquemaManutencaoPreventiva)
    .min(1, 'Cadastre pelo menos uma manutenção preventiva.'),
})

export type DadosCadastrarMaquina = z.infer<typeof esquemaCadastrarMaquina>
