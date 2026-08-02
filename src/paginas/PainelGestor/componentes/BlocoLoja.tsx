import { Store, Tag } from 'lucide-react'
import type { ReactNode } from 'react'
import type { GrupoAcessoGestorPorLoja } from '../../../utilitarios/acessoGestor'

interface BlocoLojaProps<T> {
  grupo: GrupoAcessoGestorPorLoja<T>
  mensagemVazio: string
  renderItem: (item: T, indice: number) => ReactNode
  obterChave: (item: T) => string | number
}

export function BlocoLoja<T>({
  grupo,
  mensagemVazio,
  renderItem,
  obterChave,
}: BlocoLojaProps<T>) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <Store size={16} className="text-emerald-300" />
        <h2 className="text-sm font-bold tracking-wide text-white uppercase">
          Loja: {grupo.loja.nome}
        </h2>
      </div>

      {grupo.subgrupos.map((subgrupo) => (
        <div key={subgrupo.setor ?? 'todos'} className="flex flex-col gap-2">
          {subgrupo.setor && (
            <div className="flex items-center gap-1.5 pl-1">
              <Tag size={12} className="text-slate-300" />
              <h3 className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                Setor: {subgrupo.setor}
              </h3>
            </div>
          )}

          {subgrupo.itens.length === 0 ? (
            <p className="rounded-xl bg-white/5 py-6 text-center text-xs text-slate-300">
              {mensagemVazio}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {subgrupo.itens.map((item, indice) => (
                <div key={obterChave(item)}>{renderItem(item, indice)}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
