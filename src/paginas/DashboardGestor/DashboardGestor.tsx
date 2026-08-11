import { useState } from 'react'
import {
  Activity,
  Clock,
  Gauge,
  PackageSearch,
  Timer,
  Wrench,
  CircleDollarSign,
} from 'lucide-react'
import { CabecalhoSubpagina } from '../../componentes/CabecalhoSubpagina'
import { useEstadoAutenticacao } from '../../estado/estadoAutenticacao'
import { useMaquinas } from '../../hooks/useMaquinas'
import { useIndicadoresMaquina } from '../../hooks/useIndicadoresMaquina'
import { useLojas } from '../../hooks/useLojas'
import { useSetores } from '../../hooks/useSetores'
import { agruparPorEscopoGestor } from '../../utilitarios/acessoGestor'
import { formatarMoeda } from '../../utilitarios/formatarMoeda'
import type { Maquina } from '../../tipos/maquina'
import { CORES_TIPO_DEFEITO } from './coresTipoDefeito'
import { CardIndicador } from './componentes/CardIndicador'
import { GraficoBarras } from './componentes/GraficoBarras'
import { GraficoRosca } from './componentes/GraficoRosca'
import { SeletorMaquinaDashboard } from './componentes/SeletorMaquinaDashboard'

export function DashboardGestor() {
  const escoposGestor =
    useEstadoAutenticacao((estado) => estado.escoposGestor) ?? []
  const { data: lojas = [] } = useLojas()
  const { data: setores = [] } = useSetores()
  const [maquinaSelecionadaId, setMaquinaSelecionadaId] = useState<number | null>(null)

  const { data: maquinas = [], isLoading: carregandoMaquinas } = useMaquinas()
  const grupos = agruparPorEscopoGestor(maquinas, escoposGestor, lojas, setores)

  const maquinasDisponiveis = grupos
    .flatMap((grupo) => grupo.subgrupos)
    .flatMap((subgrupo) => subgrupo.itens)

  const maquinaSelecionada: Maquina | null =
    maquinasDisponiveis.find(
      (maquina) => maquina.id === maquinaSelecionadaId,
    ) ??
    maquinasDisponiveis[0] ??
    null

  const { data: indicadores, isLoading: carregandoIndicadores } =
    useIndicadoresMaquina(maquinaSelecionada?.id ?? null)

  const segmentosRosca =
    indicadores?.porTipoDefeito.map((item) => ({
      rotulo: item.tipoDefeito,
      valor: item.horasParada,
      valorFormatado: `${item.horasParada}h`,
      cor: CORES_TIPO_DEFEITO[item.tipoDefeito],
    })) ?? []

  const barrasMensais =
    indicadores?.porMes.map((item) => ({
      rotulo: item.mes,
      valor: item.custoTotal,
      valorFormatado: formatarMoeda(item.custoTotal),
    })) ?? []

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoSubpagina
        contexto="Painel do Gestor"
        titulo="Painel de Indicadores"
        Icone={Gauge}
      />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6 sm:px-8">
        <div>
          <h1 className="font-display text-xl font-bold text-white sm:text-2xl">
            Indicadores de Máquinas
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Selecione uma máquina para ver Horas Parada, MTTR, MTBF e Custo
            Total.
          </p>
        </div>

        {carregandoMaquinas && (
          <p className="py-10 text-center text-sm text-slate-300">
            Carregando máquinas...
          </p>
        )}

        {!carregandoMaquinas && grupos.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 py-12 text-slate-300">
            <PackageSearch size={28} className="text-slate-400" />
            <p className="text-sm">Nenhuma máquina disponível nos seus setores/lojas.</p>
          </div>
        )}

        {!carregandoMaquinas && grupos.length > 0 && (
          <SeletorMaquinaDashboard
            grupos={grupos}
            maquinaSelecionadaId={maquinaSelecionada?.id ?? null}
            aoSelecionar={(maquina) => setMaquinaSelecionadaId(maquina.id)}
          />
        )}

        {maquinaSelecionada && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-white/10 pb-2">
              <Wrench size={16} className="shrink-0 text-emerald-300" />
              <h2 className="min-w-0 font-display text-sm font-bold break-words text-white">
                {maquinaSelecionada.nome}
              </h2>
              <span className="shrink-0 font-mono text-xs text-slate-400">
                · {maquinaSelecionada.setorNome}
              </span>
            </div>

            {carregandoIndicadores && (
              <p className="py-10 text-center text-sm text-slate-300">
                Carregando indicadores...
              </p>
            )}

            {indicadores && (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <CardIndicador
                    Icone={Clock}
                    rotulo="Horas Parada"
                    valor={`${indicadores.horasParadaTotal}h`}
                  />
                  <CardIndicador
                    Icone={Timer}
                    rotulo="MTTR"
                    valor={`${indicadores.mttrHoras}h`}
                  />
                  <CardIndicador
                    Icone={Activity}
                    rotulo="MTBF"
                    valor={`${indicadores.mtbfHoras}h`}
                  />
                  <CardIndicador
                    Icone={CircleDollarSign}
                    rotulo="Custo Total"
                    valor={formatarMoeda(indicadores.custoTotal)}
                  />
                </div>

                <GraficoRosca
                  titulo="Paradas por Tipo de Defeito"
                  dados={segmentosRosca}
                  rotuloCentral="Total"
                  valorCentral={`${indicadores.horasParadaTotal}h`}
                />

                <GraficoBarras
                  titulo="Custo Mensal (últimos 6 meses)"
                  dados={barrasMensais}
                />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
