import { XCircle, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface CabecalhoPainelGestorProps {
  titulo: string
  Icone: LucideIcon
}

export function CabecalhoPainelGestor({ titulo, Icone }: CabecalhoPainelGestorProps) {
  const navegar = useNavigate()

  return (
    <header className="flex w-full items-center justify-between bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-4 py-3 sm:px-8">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
          <Icone className="text-white" size={20} />
        </span>
        <div>
          <p className="text-xs font-bold tracking-widest text-white uppercase">
            Painel do Solicitante
          </p>
          <p className="text-sm text-white">{titulo}</p>
        </div>
      </div>

      <button
        type="button"
        aria-label="Fechar"
        onClick={() => navegar(-1)}
        className="text-white/90 transition hover:text-white"
      >
        <XCircle size={22} />
      </button>
    </header>
  )
}
