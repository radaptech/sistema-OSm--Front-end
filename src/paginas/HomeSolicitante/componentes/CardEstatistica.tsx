interface CardEstatisticaProps {
  valor: number
  rotulo: string
}

export function CardEstatistica({ valor, rotulo }: CardEstatisticaProps) {
  return (
    <div className="rounded-xl border border-slate-600 bg-slate-700 px-2 py-3 text-center sm:px-4 sm:py-4">
      <p className="text-xl font-bold text-white sm:text-2xl">{valor}</p>
      <p className="text-[11px] text-slate-300 sm:text-xs">{rotulo}</p>
    </div>
  )
}
