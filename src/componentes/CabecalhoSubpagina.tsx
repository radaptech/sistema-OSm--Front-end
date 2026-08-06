import { XCircle, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface CabecalhoSubpaginaProps {
  contexto: string
  titulo: string
  Icone: LucideIcon
}

export function CabecalhoSubpagina({ contexto, titulo, Icone }: CabecalhoSubpaginaProps) {
  const navegar = useNavigate()

  return (
    <header className="relative isolate overflow-hidden bg-gradient-to-r from-marca-900 to-marca-500 px-4 py-3 shadow-card sm:px-8">
      <div className="bg-grade-industrial bg-grade pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
            <Icone className="text-white" size={20} />
          </span>
          <div>
            <p className="font-mono text-xs font-bold tracking-widest text-white uppercase">
              {contexto}
            </p>
            <p className="text-sm text-white/90">{titulo}</p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Fechar"
          onClick={() => navegar(-1)}
          className="text-white/90 transition hover:scale-110 hover:text-white"
        >
          <XCircle size={22} />
        </button>
      </div>
    </header>
  )
}
