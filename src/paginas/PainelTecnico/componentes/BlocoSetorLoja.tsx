import { Store, Tag } from 'lucide-react'
import type { ReactNode } from 'react'
import type { GrupoSetorLoja } from '../../../utilitarios/agruparPorSetorLoja'
import { atrasoEntrada } from '../../../utilitarios/atrasoEntrada'

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
      <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
        <Tag size={14} className="text-marca-600" />
        <h2 className="font-display text-sm font-bold tracking-widest text-slate-800 uppercase">
          {grupo.setorNome}
        </h2>
        <span className="text-slate-500">·</span>
        <Store size={14} className="text-slate-400" />
        <h3 className="font-mono text-xs font-semibold tracking-widest text-slate-500 uppercase">
          {grupo.loja.nome}
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {grupo.itens.map((item, indice) => (
          <div
            key={obterChave(item)}
            style={atrasoEntrada(indice)}
            className="animate-surgir"
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  )
}
