import type { Loja } from '../tipos/loja'

export interface GrupoSetorLoja<T> {
  chave: string
  setor: string
  loja: Loja
  itens: T[]
}

// Agrupamento simples por Setor + Loja (ex: "Açougue - Loja 2"), sem regra de
// controle de acesso — diferente de agruparPorEscopoGestor, usado pelo Gestor.
export function agruparPorSetorLoja<T extends { setor: string; lojaId: string }>(
  itens: T[],
  lojas: Loja[],
): GrupoSetorLoja<T>[] {
  const grupos = new Map<string, GrupoSetorLoja<T>>()

  for (const item of itens) {
    const chave = `${item.setor}__${item.lojaId}`
    const grupoExistente = grupos.get(chave)

    if (grupoExistente) {
      grupoExistente.itens.push(item)
      continue
    }

    const loja = lojas.find((candidata) => candidata.id === item.lojaId) ?? {
      id: item.lojaId,
      nome: item.lojaId,
      empresaId: '',
    }

    grupos.set(chave, { chave, setor: item.setor, loja, itens: [item] })
  }

  return [...grupos.values()].sort((a, b) => {
    const comparacaoSetor = a.setor.localeCompare(b.setor, 'pt-BR')

    return comparacaoSetor !== 0
      ? comparacaoSetor
      : a.loja.nome.localeCompare(b.loja.nome, 'pt-BR')
  })
}
