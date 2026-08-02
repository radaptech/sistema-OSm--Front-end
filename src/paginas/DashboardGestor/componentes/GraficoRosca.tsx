interface SegmentoRosca {
  rotulo: string
  valor: number
  valorFormatado: string
  cor: string
}

interface GraficoRoscaProps {
  titulo: string
  dados: SegmentoRosca[]
  rotuloCentral: string
  valorCentral: string
}

const TAMANHO = 160
const RAIO = 60
const CENTRO = TAMANHO / 2
const ESPESSURA = 20
const CIRCUNFERENCIA = 2 * Math.PI * RAIO
const GAP = 3

export function GraficoRosca({
  titulo,
  dados,
  rotuloCentral,
  valorCentral,
}: GraficoRoscaProps) {
  const total = dados.reduce((soma, item) => soma + item.valor, 0)

  const comprimentos = dados.map((item) =>
    total > 0 ? (item.valor / total) * CIRCUNFERENCIA : 0,
  )
  const deslocamentos = comprimentos.map((_, indice) =>
    comprimentos.slice(0, indice).reduce((soma, valor) => soma + valor, 0),
  )

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700">{titulo}</h3>

      {total === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          Sem paradas registradas no período.
        </p>
      ) : (
        <div className="mt-3 flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <div
            className="relative shrink-0"
            style={{ width: TAMANHO, height: TAMANHO }}
          >
            <svg
              width={TAMANHO}
              height={TAMANHO}
              viewBox={`0 0 ${TAMANHO} ${TAMANHO}`}
            >
              <circle
                cx={CENTRO}
                cy={CENTRO}
                r={RAIO}
                fill="none"
                stroke="#e1e0d9"
                strokeWidth={ESPESSURA}
              />
              {dados.map((item, indice) => {
                const comprimento = comprimentos[indice]
                const comprimentoRenderizado = Math.max(comprimento - GAP, 0)
                const offset = deslocamentos[indice]

                return (
                  <circle
                    key={item.rotulo}
                    cx={CENTRO}
                    cy={CENTRO}
                    r={RAIO}
                    fill="none"
                    stroke={item.cor}
                    strokeWidth={ESPESSURA}
                    strokeLinecap="butt"
                    strokeDasharray={`${comprimentoRenderizado} ${CIRCUNFERENCIA - comprimentoRenderizado}`}
                    strokeDashoffset={-offset - GAP / 2}
                    transform={`rotate(-90 ${CENTRO} ${CENTRO})`}
                  >
                    <title>
                      {item.rotulo}: {item.valorFormatado}
                    </title>
                  </circle>
                )
              })}
            </svg>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-lg font-bold text-slate-800">{valorCentral}</p>
              <p className="text-[10px] text-slate-400 uppercase">
                {rotuloCentral}
              </p>
            </div>
          </div>

          <ul className="flex w-full flex-col gap-1.5">
            {dados.map((item) => (
              <li
                key={item.rotulo}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.cor }}
                  />
                  <span className="truncate text-slate-600">{item.rotulo}</span>
                </span>
                <span className="shrink-0 font-semibold text-slate-800">
                  {item.valorFormatado}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
