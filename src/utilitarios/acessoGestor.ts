import type { EscopoAcessoGestor } from '../tipos/autenticacao'
import type { Setor } from '../tipos/maquina'

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
