import { z } from 'zod'
import {
  criarEsquemaItensCusto,
  esquemaNotaFiscal,
} from '../../componentes/esquemaCustoOS'

// Toda OS passa pelo Técnico — inclusive a que ele encaminhou para uma empresa externa —
// então os custos já chegam preenchidos do encerramento (item 11 do CLAUDE.md). Aqui o
// Administrador só corrige, tipicamente conferindo cada valor contra a nota fiscal.
//
// O esquema depende do tipo da OS (só maquinário cobra hora do técnico), então é uma
// função e não uma constante — mesmo desenho do encerramento. Antes era constante porque
// os dois custos eram campos escalares e a regra de tipo vivia só no servidor; com a
// lista, a regra passou a valer item a item e o formulário precisa conhecê-la para não
// oferecer uma categoria que o servidor vai recusar.
export function criarEsquemaLancarCustoManutencao(exigirHoraTecnica: boolean) {
  return z.object({
    // A lista inteira, corrigida: é substituição, não patch. O modal abre pré-preenchido
    // com o que o Técnico lançou, então o que volta é o conjunto completo.
    itens: criarEsquemaItensCusto(exigirHoraTecnica),
    // Declarado pelo Técnico no encerramento, corrigível aqui pelo Administrador: é ele
    // que libera a lista abaixo. Desmarcado, o servidor apaga as notas gravadas.
    temNotaFiscal: z.boolean(),
    // Nota fiscal vale em qualquer tipo de OS: é o documento que embasa o custo lançado —
    // a fatura da empresa em terceiros, a nota da peça em maquinário, a do material em
    // reparo. São VÁRIAS porque duas peças compradas em lojas diferentes geram dois
    // documentos. Lista vazia é legítima: nem toda OS teve compra, e a que teve pode
    // ainda não ter sido conferida.
    notasFiscais: z.array(esquemaNotaFiscal),
    descricaoServicoTerceiro: z
      .string()
      .max(300, 'A descrição deve ter no máximo 300 caracteres.')
      .optional(),
  })
}

export type DadosLancarCustoManutencao = z.infer<
  ReturnType<typeof criarEsquemaLancarCustoManutencao>
>
