import { Store, Tag } from 'lucide-react'
import type { ReactNode } from 'react'
import type { GrupoSetorLoja } from '../../../utilitarios/agruparPorSetorLoja'

interface BlocoSetorLojaProps<T> {
  grupo: GrupoSetorLoja<T>
  renderItem: (item: T) => ReactNode
  obterChave: (item: T) => string | number
}

export function BlocoSetorLoja<T>({
  grupo,
  renderItem,
  obterChave,
}: BlocoSetorLojaProps<T>) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <Tag size={14} className="text-marca-300" />
        <h2 className="font-display text-sm font-bold tracking-wide text-white uppercase">
          {grupo.setorNome}
        </h2>
        <span className="text-slate-500">·</span>
        <Store size={14} className="text-slate-300" />
        <h3 className="font-mono text-xs font-semibold tracking-wide text-slate-300 uppercase">
          {grupo.loja.nome}
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {grupo.itens.map((item) => (
          <div key={obterChave(item)}>{renderItem(item)}</div>
        ))}
      </div>
    </div>
  )
}
