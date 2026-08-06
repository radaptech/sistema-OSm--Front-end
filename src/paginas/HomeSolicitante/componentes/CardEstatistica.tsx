interface CardEstatisticaProps {
  valor: number
  rotulo: string
}

export function CardEstatistica({ valor, rotulo }: CardEstatisticaProps) {
  return (
    <div className="rounded-xl border border-slate-600 bg-slate-700 px-2 py-3 text-center shadow-card transition-transform duration-200 hover:-translate-y-0.5 sm:px-4 sm:py-4">
      <p className="font-display text-xl font-bold text-white sm:text-2xl">{valor}</p>
      <p className="font-mono text-[11px] tracking-wide text-slate-300 uppercase sm:text-xs">
        {rotulo}
      </p>
    </div>
  )
}
