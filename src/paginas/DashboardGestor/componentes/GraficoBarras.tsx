interface BarraMensal {
  rotulo: string
  valor: number
  valorFormatado: string
}

interface GraficoBarrasProps {
  titulo: string
  dados: BarraMensal[]
}

const COR_BARRA = '#2a78d6'

export function GraficoBarras({ titulo, dados }: GraficoBarrasProps) {
  const valorMaximo = Math.max(...dados.map((item) => item.valor), 1)

  return (
    <div className="rounded-2xl bg-white p-4 shadow-card">
      <h3 className="font-display text-sm font-semibold text-slate-700">{titulo}</h3>

      <div className="mt-4 flex h-36 items-end gap-2">
        {dados.map((item) => {
          const alturaPercentual = Math.max((item.valor / valorMaximo) * 100, 3)

          return (
            <div
              key={item.rotulo}
              className="group relative flex flex-1 flex-col items-center"
            >
              <div
                className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-2 py-1 font-mono text-[10px] font-semibold whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100"
                role="tooltip"
              >
                {item.valorFormatado}
              </div>

              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-[4px] transition group-hover:brightness-110"
                  style={{
                    height: `${alturaPercentual}%`,
                    backgroundColor: COR_BARRA,
                  }}
                />
              </div>

              <span className="mt-1.5 font-mono text-[10px] text-slate-400">
                {item.rotulo}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
