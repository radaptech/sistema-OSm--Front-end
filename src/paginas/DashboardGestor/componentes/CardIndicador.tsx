import type { LucideIcon } from 'lucide-react'

interface CardIndicadorProps {
  Icone: LucideIcon
  rotulo: string
  valor: string
}

export function CardIndicador({ Icone, rotulo, valor }: CardIndicadorProps) {
  return (
    <div className="min-w-0 rounded-xl bg-white p-3 shadow-card sm:p-4">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-r from-marca-900 to-marca-500 text-white">
          <Icone size={12} />
        </span>
        <p className="truncate font-mono text-[10px] font-semibold text-slate-400 uppercase">
          {rotulo}
        </p>
      </div>
      <p className="mt-2 truncate font-mono text-base font-bold text-slate-800 sm:text-lg">
        {valor}
      </p>
    </div>
  )
}
