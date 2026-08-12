import { z } from 'zod'
import { tiposDefeito } from '../../tipos/ordemServico'

const custoManutencao = z
  .number('Informe o custo de manutenção.')
  .nonnegative('O custo não pode ser negativo.')
  .max(999999, 'Informe um valor de até R$ 999.999.')

const custoHoraTecnicoObrigatorio = z
  .number('Informe o custo hora do técnico.')
  .nonnegative('O custo não pode ser negativo.')
  .max(999999, 'Informe um valor de até R$ 999.999.')

// Só "Maquinário" cobra Custo Hora Técnico. Em 'terceiros' (ver AcionamentoTerceiroPayload)
// quem executou foi a empresa externa, não o Técnico; em 'reparo' o serviço é pequeno
// demais para justificar hora técnica — só o Custo de Manutenção entra nos dois casos.
export function criarEsquemaEncerrarOrdemServico(exigirCustoHoraTecnico: boolean) {
  return z.object({
    // Classificação da OS: quem executou o serviço é quem sabe dizer se foi Predial ou
    // Corretiva — o Solicitante não escolhe isso ao abrir o pedido.
    tipoDefeito: z.enum(tiposDefeito, 'Selecione o tipo de OS.'),
    defeitoConstatado: z
      .string()
      .min(10, 'Descreva o defeito constatado.')
      .max(500, 'A descrição deve ter no máximo 500 caracteres.'),
    causaRaiz: z
      .string()
      .min(10, 'Descreva a causa raiz identificada.')
      .max(500, 'A descrição deve ter no máximo 500 caracteres.'),
    solucao: z
      .string()
      .min(10, 'Descreva a solução aplicada.')
      .max(500, 'A descrição deve ter no máximo 500 caracteres.'),
    custoHoraTecnico: exigirCustoHoraTecnico
      ? custoHoraTecnicoObrigatorio
      : custoHoraTecnicoObrigatorio.optional(),
    custoManutencao,
  })
}

export type DadosEncerrarOrdemServico = z.infer<
  ReturnType<typeof criarEsquemaEncerrarOrdemServico>
>
