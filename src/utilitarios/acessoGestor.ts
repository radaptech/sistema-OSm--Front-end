import type { EscopoAcessoGestor } from '../tipos/autenticacao'
import type { Setor } from '../tipos/maquina'
import type { Loja } from '../tipos/loja'

export function gestorTemAcesso(
  escopos: EscopoAcessoGestor[],
  lojaId: string,
  setor: Setor,
): boolean {
  return escopos.some((escopo) => {
    if (escopo.lojaId !== lojaId) {
      return false
    }

    return escopo.setores === 'todos' || escopo.setores.includes(setor)
  })
}

export function filtrarPorAcessoGestor<T extends { lojaId: string; setor: Setor }>(
  itens: T[],
  escopos: EscopoAcessoGestor[],
): T[] {
  return itens.filter((item) => gestorTemAcesso(escopos, item.lojaId, item.setor))
}

export function obterLojasIdsPermitidas(escopos: EscopoAcessoGestor[]): string[] {
  return [...new Set(escopos.map((escopo) => escopo.lojaId))]
}

export interface SubgrupoAcessoGestor<T> {
  setor: Setor | null
  itens: T[]
}

export interface GrupoAcessoGestorPorLoja<T> {
  loja: Loja
  subgrupos: SubgrupoAcessoGestor<T>[]
}

// setor: null no subgrupo representa escopo 'todos' (loja inteira, sem divisão por setor)
export function agruparPorEscopoGestor<T extends { lojaId: string; setor: Setor }>(
  itens: T[],
  escopos: EscopoAcessoGestor[],
  lojas: Loja[],
): GrupoAcessoGestorPorLoja<T>[] {
  return escopos.flatMap((escopo) => {
    const loja = lojas.find((candidata) => candidata.id === escopo.lojaId)

    if (!loja) {
      return []
    }

    const itensDaLoja = itens.filter((item) => item.lojaId === escopo.lojaId)

    const subgrupos: SubgrupoAcessoGestor<T>[] =
      escopo.setores === 'todos'
        ? [{ setor: null, itens: itensDaLoja }]
        : escopo.setores.map((setor) => ({
            setor,
            itens: itensDaLoja.filter((item) => item.setor === setor),
          }))

    return [{ loja, subgrupos }]
  })
}
