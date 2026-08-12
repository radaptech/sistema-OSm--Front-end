import { Inbox, Store, Tag } from 'lucide-react'
import type { ReactNode } from 'react'
import type { GrupoAcessoGestorPorLoja } from '../../../utilitarios/acessoGestor'
import { atrasoEntrada } from '../../../utilitarios/atrasoEntrada'

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
        <h2 className="font-display text-sm font-bold tracking-wide text-white uppercase">
          Loja: {grupo.loja.nome}
        </h2>
      </div>

      {grupo.subgrupos.map((subgrupo) => (
        <div key={subgrupo.setorId ?? 'todos'} className="flex flex-col gap-2">
          {subgrupo.setorNome && (
            <div className="flex items-center gap-1.5 pl-1">
              <Tag size={12} className="text-slate-300" />
              <h3 className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                Setor: {subgrupo.setorNome}
              </h3>
            </div>
          )}

          {subgrupo.itens.length === 0 ? (
            <div className="flex flex-col items-center gap-1.5 rounded-xl bg-white/5 py-6 text-center text-slate-400">
              <Inbox size={20} />
              <p className="text-xs">{mensagemVazio}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {subgrupo.itens.map((item, indice) => (
                <div
                  key={obterChave(item)}
                  style={atrasoEntrada(indice)}
                  className="animate-surgir"
                >
                  {renderItem(item, indice)}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
