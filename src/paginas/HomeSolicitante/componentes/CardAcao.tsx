import type { LucideIcon } from 'lucide-react'

interface CardAcaoProps {
  titulo: string
  descricao: string
  Icone: LucideIcon
  variante?: 'padrao' | 'destaque'
  aoClicar?: () => void
}

export function CardAcao({
  titulo,
  descricao,
  Icone,
  variante = 'padrao',
  aoClicar,
}: CardAcaoProps) {
  const ehDestaque = variante === 'destaque'

  return (
    <button
      type="button"
      onClick={aoClicar}
      className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left transition hover:brightness-110 ${
        ehDestaque ? 'bg-emerald-600' : 'bg-slate-700'
      }`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          ehDestaque ? 'bg-white/15' : 'bg-emerald-600'
        }`}
      >
        <Icone className="text-white" size={24} />
      </span>
      <span className="flex flex-col">
        <span className="font-semibold text-white">{titulo}</span>
        <span className="text-sm text-slate-200">{descricao}</span>
      </span>
    </button>
  )
}
