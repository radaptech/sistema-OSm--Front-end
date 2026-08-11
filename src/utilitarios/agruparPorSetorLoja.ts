import type { Loja } from '../tipos/loja'

export interface GrupoSetorLoja<T> {
  chave: string
  setorNome: string
  loja: Loja
  itens: T[]
}

interface ItemAgrupavel {
  setorId: number
  setorNome: string
  lojaId: number
  lojaNome?: string
}

// Agrupamento simples por Setor + Loja (ex: "Açougue - Loja 2"), sem regra de
// controle de acesso — diferente de agruparPorEscopoGestor, usado pelo Gestor.
export function agruparPorSetorLoja<T extends ItemAgrupavel>(
  itens: T[],
  lojas: Loja[],
): GrupoSetorLoja<T>[] {
  const grupos = new Map<string, GrupoSetorLoja<T>>()

  for (const item of itens) {
    const chave = `${item.setorId}__${item.lojaId}`
    const grupoExistente = grupos.get(chave)

    if (grupoExistente) {
      grupoExistente.itens.push(item)
      continue
    }

    // A OS já traz lojaNome resolvido pelo servidor; a lista de lojas é só um reforço
    // para quando o agrupamento receber itens de outra origem.
    const loja = lojas.find((candidata) => candidata.id === item.lojaId) ?? {
      id: item.lojaId,
      nome: item.lojaNome ?? `Loja ${item.lojaId}`,
      empresaId: 0,
    }

    grupos.set(chave, { chave, setorNome: item.setorNome, loja, itens: [item] })
  }

  return [...grupos.values()].sort((a, b) => {
    const comparacaoSetor = a.setorNome.localeCompare(b.setorNome, 'pt-BR')

    return comparacaoSetor !== 0
      ? comparacaoSetor
      : a.loja.nome.localeCompare(b.loja.nome, 'pt-BR')
  })
}
