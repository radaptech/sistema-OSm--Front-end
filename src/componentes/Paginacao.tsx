import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginacaoProps {
  pagina: number
  totalPaginas: number
  aoMudarPagina: (pagina: number) => void
}

export function Paginacao({ pagina, totalPaginas, aoMudarPagina }: PaginacaoProps) {
  const desabilitarAnterior = pagina <= 1
  const desabilitarProxima = pagina >= totalPaginas

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        disabled={desabilitarAnterior}
        onClick={() => aoMudarPagina(pagina - 1)}
        className="flex items-center gap-1 rounded-lg bg-slate-500 px-4 py-2 text-sm font-semibold text-slate-300 transition disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:bg-slate-400 enabled:text-white"
      >
        <ChevronLeft size={16} />
        Anterior
      </button>

      <span className="text-sm text-slate-200">
        Página <span className="font-semibold text-white">{pagina}</span> de{' '}
        <span className="font-semibold text-white">{totalPaginas}</span>
      </span>

      <button
        type="button"
        disabled={desabilitarProxima}
        onClick={() => aoMudarPagina(pagina + 1)}
        className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:brightness-110"
      >
        Próxima
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
