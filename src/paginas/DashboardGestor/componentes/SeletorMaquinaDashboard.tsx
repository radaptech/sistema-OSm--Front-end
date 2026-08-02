import { Store, Tag, Wrench } from 'lucide-react'
import type { GrupoAcessoGestorPorLoja } from '../../../utilitarios/acessoGestor'
import type { Maquina } from '../../../tipos/maquina'

interface SeletorMaquinaDashboardProps {
  grupos: GrupoAcessoGestorPorLoja<Maquina>[]
  maquinaSelecionadaId: string | null
  aoSelecionar: (maquina: Maquina) => void
}

export function SeletorMaquinaDashboard({
  grupos,
  maquinaSelecionadaId,
  aoSelecionar,
}: SeletorMaquinaDashboardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white/5 p-4">
      {grupos.map((grupo) => (
        <div key={grupo.loja.id} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Store size={14} className="text-emerald-300" />
            <h2 className="text-xs font-bold tracking-wide text-white uppercase">
              {grupo.loja.nome}
            </h2>
          </div>

          {grupo.subgrupos.map((subgrupo) => (
            <div
              key={subgrupo.setor ?? 'todos'}
              className="flex flex-col gap-1.5 pl-1"
            >
              {subgrupo.setor && (
                <div className="flex items-center gap-1.5">
                  <Tag size={11} className="text-slate-300" />
                  <h3 className="text-[11px] font-semibold text-slate-300 uppercase">
                    {subgrupo.setor}
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
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                          selecionada
                            ? 'bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] text-white'
                            : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
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
