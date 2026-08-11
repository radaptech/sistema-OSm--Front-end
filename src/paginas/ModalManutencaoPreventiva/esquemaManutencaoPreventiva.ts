import { z } from 'zod'

export const esquemaManutencaoPreventiva = z.object({
  maquinaId: z.number().int().nonnegative(),
  descricao: z
    .string()
    .min(3, 'Descreva o procedimento de manutenção.')
    .max(300, 'A descrição deve ter no máximo 300 caracteres.'),
  intervaloDias: z
    .number('Informe o intervalo em dias.')
    .int('Informe um número inteiro de dias.')
    .min(1, 'O intervalo deve ser de pelo menos 1 dia.')
    .max(3650, 'Informe um intervalo de até 3650 dias.'),
  // Vem do <input type="date"> em YYYY-MM-DD; o serviço converte para dd/mm/yyyy no envio.
  proximaData: z.string().min(1, 'Informe a próxima data.'),
  ativa: z.boolean(),
})

export type DadosManutencaoPreventiva = z.infer<typeof esquemaManutencaoPreventiva>
