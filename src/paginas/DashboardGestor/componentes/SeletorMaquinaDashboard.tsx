import { Store, Tag, Wrench } from 'lucide-react'
import type { GrupoAcessoGestorPorLoja } from '../../../utilitarios/acessoGestor'
import type { Maquina } from '../../../tipos/maquina'

interface SeletorMaquinaDashboardProps {
  grupos: GrupoAcessoGestorPorLoja<Maquina>[]
  maquinaSelecionadaId: number | null
  aoSelecionar: (maquina: Maquina) => void
}

export function SeletorMaquinaDashboard({
  grupos,
  maquinaSelecionadaId,
  aoSelecionar,
}: SeletorMaquinaDashboardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/60 bg-slate-50/50 p-4">
      {grupos.map((grupo) => (
        <div key={grupo.loja.id} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Store size={14} className="text-marca-600" />
            <h2 className="font-display text-xs font-bold tracking-widest text-slate-800 uppercase">
              {grupo.loja.nome}
            </h2>
          </div>

          {grupo.subgrupos.map((subgrupo) => (
            <div
              key={subgrupo.setorId ?? 'todos'}
              className="flex flex-col gap-1.5 pl-1"
            >
              {subgrupo.setorNome && (
                <div className="flex items-center gap-1.5">
                  <Tag size={11} className="text-slate-400" />
                  <h3 className="text-[11px] font-semibold text-slate-500 uppercase">
                    {subgrupo.setorNome}
                  </h3>
                </div>
              )}

              {subgrupo.itens.length === 0 ? (
                <p className="text-xs text-slate-400">
                  Nenhuma máquina neste setor.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {subgrupo.itens.map((maquina) => {
                    const selecionada = maquina.id === maquinaSelecionadaId

                    return (
                      <button
                        key={maquina.id}
                        type="button"
                        onClick={() => aoSelecionar(maquina)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                          selecionada
                            ? 'bg-marca-600 text-white shadow-sm shadow-marca-600/20'
                            : 'border border-slate-200/60 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <Wrench size={12} />
                        {maquina.nome}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
