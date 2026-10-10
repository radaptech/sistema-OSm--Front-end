import { Activity, CircleDollarSign, Clock, Timer } from 'lucide-react'
import { Esqueleto } from '../../../componentes/Esqueleto'
import { formatarHoras } from '../../../utilitarios/formatarHoras'
import { formatarMoeda } from '../../../utilitarios/formatarMoeda'
import type { ResumoIndicadores } from '../../../tipos/indicadorMaquina'
import { CardIndicador } from './CardIndicador'

interface GradeIndicadoresProps {
  resumo: ResumoIndicadores
}

// Os quatro cards do painel, na mesma ordem em toda etapa (loja e máquina).
export function GradeIndicadores({ resumo }: GradeIndicadoresProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <CardIndicador
        Icone={Clock}
        rotulo="Horas Parada"
        valor={formatarHoras(resumo.horasParadaTotal)}
      />
      <CardIndicador
        Icone={Timer}
        rotulo="MTTR"
        valor={formatarHoras(resumo.mttrHoras)}
      />
      <CardIndicador
        Icone={Activity}
        rotulo="MTBF"
        valor={formatarHoras(resumo.mtbfHoras)}
      />
      <CardIndicador
        Icone={CircleDollarSign}
        rotulo="Custo Total"
        valor={formatarMoeda(resumo.custoTotal)}
      />
    </div>
  )
}

export function EsqueletoGradeIndicadores() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: 4 }, (_, indice) => (
        <div key={indice} className="shadow-card rounded-2xl bg-white p-4">
          <Esqueleto className="h-4 w-4 rounded" />
          <Esqueleto className="mt-3 h-3 w-20" />
          <Esqueleto className="mt-2 h-5 w-16" />
        </div>
      ))}
    </div>
  )
}
