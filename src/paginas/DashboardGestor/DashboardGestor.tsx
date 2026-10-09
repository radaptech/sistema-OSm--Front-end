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
import { Esqueleto } from '../../componentes/Esqueleto'
import { useEstadoAutenticacao } from '../../estado/estadoAutenticacao'
import { useMaquinas } from '../../hooks/useMaquinas'
import { useIndicadoresMaquina } from '../../hooks/useIndicadoresMaquina'
import { useLojas } from '../../hooks/useLojas'
import { useSetores } from '../../hooks/useSetores'
import { agruparPorEscopoGestor } from '../../utilitarios/acessoGestor'
import { formatarHoras } from '../../utilitarios/formatarHoras'
import { formatarMoeda } from '../../utilitarios/formatarMoeda'
import type { Maquina } from '../../tipos/maquina'
import type { ResumoIndicadores } from '../../tipos/indicadorMaquina'
import { tiposDefeito } from '../../tipos/ordemServico'
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
  const [maquinaSelecionadaId, setMaquinaSelecionadaId] = useState<
    number | null
  >(null)
  // "MM/YYYY" do mês clicado no gráfico; null mostra o histórico inteiro.
  const [mesSelecionado, setMesSelecionado] = useState<string | null>(null)

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

  // Mês sem OS encerrada não vem do servidor: o resumo dele é zero em tudo.
  const resumo: ResumoIndicadores | undefined =
    indicadores && mesSelecionado
      ? (indicadores.porMes.find((item) => item.mes === mesSelecionado) ?? {
          horasParadaTotal: 0,
          mttrHoras: 0,
          mtbfHoras: 0,
          custoTotal: 0,
          porTipoDefeito: tiposDefeito.map((tipoDefeito) => ({
            tipoDefeito,
            horasParada: 0,
          })),
        })
      : indicadores

  const segmentosRosca =
    resumo?.porTipoDefeito.map((item) => ({
      rotulo: item.tipoDefeito,
      valor: item.horasParada,
      valorFormatado: formatarHoras(item.horasParada),
      cor: CORES_TIPO_DEFEITO[item.tipoDefeito],
    })) ?? []

  // O servidor só devolve os meses que tiveram custo; o eixo mostra sempre os 12
  // meses do calendário até o atual, com zero nos vazios.
  const custoPorMes = new Map(
    indicadores?.porMes.map((item) => [item.mes, item.custoTotal]),
  )
  const hoje = new Date()
  const barrasMensais = indicadores
    ? Array.from({ length: 12 }, (_, indice) => {
        const data = new Date(
          hoje.getFullYear(),
          hoje.getMonth() - 11 + indice,
          1,
        )
        const mes = String(data.getMonth() + 1).padStart(2, '0')
        const chave = `${mes}/${data.getFullYear()}`
        const custo = custoPorMes.get(chave) ?? 0

        return {
          chave,
          // "05/26": 12 colunas não comportam o ano inteiro no celular.
          rotulo: `${mes}/${String(data.getFullYear()).slice(2)}`,
          valor: custo,
          valorFormatado: formatarMoeda(custo),
        }
      })
    : []

  return (
    <div className="flex min-h-svh flex-col bg-slate-50">
      <CabecalhoSubpagina
        contexto="Painel do Gestor"
        titulo="Painel de Indicadores"
        Icone={Gauge}
      />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6 sm:px-8">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Indicadores de Máquinas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Selecione uma máquina para ver Horas Parada, MTTR, MTBF e Custo
            Total.
          </p>
        </div>

        {carregandoMaquinas && (
          <div
            role="status"
            aria-busy="true"
            aria-label="Carregando máquinas"
            className="shadow-card flex flex-col gap-3 rounded-2xl bg-white p-4"
          >
            <Esqueleto className="h-3 w-32" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }, (_, indice) => (
                <Esqueleto key={indice} className="h-9 w-36 rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {!carregandoMaquinas && grupos.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200/60 bg-white py-12 text-slate-400">
            <PackageSearch size={28} className="text-slate-400" />
            <p className="text-sm">
              Nenhuma máquina disponível nos seus setores/lojas.
            </p>
          </div>
        )}

        {!carregandoMaquinas && grupos.length > 0 && (
          <SeletorMaquinaDashboard
            grupos={grupos}
            maquinaSelecionadaId={maquinaSelecionada?.id ?? null}
            aoSelecionar={(maquina) => {
              setMaquinaSelecionadaId(maquina.id)
              // O mês da máquina anterior não diz nada sobre esta.
              setMesSelecionado(null)
            }}
          />
        )}

        {maquinaSelecionada && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-slate-200/60 pb-2">
              <Wrench size={16} className="shrink-0 text-emerald-300" />
              <h2 className="font-display min-w-0 text-sm font-bold break-words text-slate-800">
                {maquinaSelecionada.nome}
              </h2>
              <span className="shrink-0 font-mono text-xs text-slate-400">
                · {maquinaSelecionada.setorNome}
              </span>
            </div>

            {/* Esqueleto no formato exato do painel (4 indicadores + rosca + barras):
                quando os números chegam nada muda de lugar. */}
            {carregandoIndicadores && (
              <div
                role="status"
                aria-busy="true"
                aria-label="Carregando indicadores"
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Array.from({ length: 4 }, (_, indice) => (
                    <div
                      key={indice}
                      className="shadow-card rounded-2xl bg-white p-4"
                    >
                      <Esqueleto className="h-4 w-4 rounded" />
                      <Esqueleto className="mt-3 h-3 w-20" />
                      <Esqueleto className="mt-2 h-5 w-16" />
                    </div>
                  ))}
                </div>
                <div className="shadow-card mt-4 flex flex-col items-center gap-4 rounded-2xl bg-white p-5">
                  <Esqueleto className="h-3 w-44" />
                  <Esqueleto className="h-40 w-40 rounded-full" />
                </div>
                <div className="shadow-card mt-4 rounded-2xl bg-white p-5">
                  <Esqueleto className="h-3 w-52" />
                  <Esqueleto className="mt-4 h-40 w-full rounded-lg" />
                </div>
              </div>
            )}

            {indicadores && resumo && (
              <>
                <div className="-mb-1 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    {mesSelecionado
                      ? `Exibindo ${mesSelecionado}`
                      : 'Exibindo histórico completo'}
                  </p>
                  {mesSelecionado ? (
                    <button
                      type="button"
                      onClick={() => setMesSelecionado(null)}
                      className="text-marca-600 text-xs font-semibold hover:underline"
                    >
                      Ver histórico completo
                    </button>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Clique num mês do gráfico para filtrar
                    </p>
                  )}
                </div>

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

                <GraficoRosca
                  titulo="Paradas por Tipo de OS"
                  subtitulo="Horas de máquina parada, por tipo de serviço"
                  dados={segmentosRosca}
                  rotuloCentral="Parada total"
                  valorCentral={formatarHoras(resumo.horasParadaTotal)}
                />

                <GraficoBarras
                  titulo="Custo Mensal (últimos 12 meses)"
                  dados={barrasMensais}
                  selecionada={mesSelecionado}
                  aoSelecionar={(chave) =>
                    setMesSelecionado((atual) =>
                      atual === chave ? null : chave,
                    )
                  }
                />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
