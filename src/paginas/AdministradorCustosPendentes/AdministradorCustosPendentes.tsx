import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleDollarSign } from 'lucide-react'
import { toast } from 'react-toastify'
import { CabecalhoSubpagina } from '../../componentes/CabecalhoSubpagina'
import { BadgeTipoOS } from '../../componentes/BadgeTipoOS'
import { CampoBusca } from '../../componentes/CampoBusca'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { FiltroTipoOS } from '../../componentes/FiltroTipoOS'
import { useLojas } from '../../hooks/useLojas'
import { useOrdensServicoTodas } from '../../hooks/useOrdensServicoTodas'
import { servicoOrdensServico } from '../../servicos/servicoOrdensServico'
import { formatarDataHora } from '../../utilitarios/formatarData'
import { formatarMoeda } from '../../utilitarios/formatarMoeda'
import type { OrdemServico, TipoOS } from '../../tipos/ordemServico'
import { ModalLancarCustoManutencao } from './componentes/ModalLancarCustoManutencao'
import type { DadosLancarCustoManutencao } from './esquemaLancarCustoManutencao'

export function AdministradorCustosPendentes() {
  const queryClient = useQueryClient()
  const [busca, setBusca] = useState('')
  const [filtroLoja, setFiltroLoja] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<TipoOS | ''>('')
  const [ordemParaLancarCusto, setOrdemParaLancarCusto] =
    useState<OrdemServico | null>(null)

  // Toda OS Concluída, com ou sem custo lançado: o Técnico já grava os dois custos no
  // encerramento e o Administrador só corrige se quiser — inclusive nas OS que foram
  // executadas por empresa externa, que também passam pelo Técnico.
  const { data: ordensServico = [], isLoading } = useOrdensServicoTodas({
    status: ['Concluída'],
    busca: busca.trim() || undefined,
    lojaId: filtroLoja ? Number(filtroLoja) : undefined,
    tipo: filtroTipo || undefined,
  })
  const { data: lojas = [] } = useLojas()

  const { mutateAsync: lancarCusto } = useMutation({
    mutationFn: servicoOrdensServico.lancarCustoManutencao,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['ordens-servico-todas'] }),
  })

  // Lista TODA OS Concluída (não só as com custoManutencao ainda vazio): o Técnico já
  // grava os dois custos no encerramento (item 11 do CLAUDE.md), então eles chegam aqui
  // pré-preenchidos e o Administrador só edita se precisar conferir contra a nota.
  const ordensConcluidas = ordensServico

  async function aoSalvarCusto(dados: DadosLancarCustoManutencao) {
    if (!ordemParaLancarCusto) {
      return
    }

    await lancarCusto({ ordemServicoId: ordemParaLancarCusto.id, ...dados })
    toast.success(`Custos atualizados para a OS #${ordemParaLancarCusto.id}.`)
    setOrdemParaLancarCusto(null)
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoSubpagina
        contexto="Painel do Administrador"
        titulo="Custos Pendentes"
        Icone={CircleDollarSign}
      />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6 sm:px-8 lg:max-w-6xl">
        <p className="text-sm text-slate-300">
          Toda OS chega com Custo Hora do Técnico e Custo de Manutenção
          preenchidos pelo próprio Técnico no encerramento — edite aqui só se
          precisar corrigir algo. Nas OS executadas por empresa terceirizada,
          confira o Custo de Manutenção contra a nota fiscal da empresa.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <CampoBusca
            valor={busca}
            aoMudar={setBusca}
            placeholder="Buscar por máquina ou código..."
          />

          <div className="sm:w-56 sm:shrink-0">
            <CampoSelecao
              rotulo="Loja"
              value={filtroLoja}
              onChange={(evento) => setFiltroLoja(evento.target.value)}
            >
              <option value="">Todas as lojas</option>
              {lojas.map((loja) => (
                <option key={loja.id} value={loja.id}>
                  {loja.nome}
                </option>
              ))}
            </CampoSelecao>
          </div>

          <div className="sm:w-56 sm:shrink-0">
            <FiltroTipoOS valor={filtroTipo} aoMudar={setFiltroTipo} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 lg:grid lg:grid-cols-2 lg:content-start lg:items-start lg:gap-4">
          {isLoading && (
            <p className="py-10 text-center text-sm text-slate-300 lg:col-span-2">
              Carregando...
            </p>
          )}

          {!isLoading && ordensConcluidas.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white/10 py-12 text-slate-400 lg:col-span-2">
              <CircleDollarSign size={28} />
              <p className="text-sm">
                Nenhuma OS concluída encontrada para esses filtros.
              </p>
            </div>
          )}

          {ordensConcluidas.map((ordem) => {
            return (
              <div
                key={ordem.id}
                className="shadow-card hover:shadow-card-hover flex flex-col gap-3 rounded-xl bg-white p-4 transition-shadow duration-200 sm:flex-row sm:items-center sm:justify-between lg:[&:last-child:nth-child(odd)]:col-span-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="from-marca-900 to-marca-500 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r font-mono text-sm font-bold text-white">
                      #{ordem.id}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {ordem.maquinaNome}
                    </span>
                    <span className="font-mono text-sm text-slate-400">
                      · {ordem.maquinaCodigo}
                    </span>
                    <BadgeTipoOS tipo={ordem.tipo} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {lojas.find((loja) => loja.id === ordem.lojaId)?.nome ??
                      ordem.lojaId}{' '}
                    · {ordem.setorNome} · Encerrada em{' '}
                    {ordem.dataFim ? formatarDataHora(ordem.dataFim) : '—'}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Custo Hora do Técnico:{' '}
                    {ordem.custo?.custoHoraTecnico !== undefined
                      ? formatarMoeda(ordem.custo?.custoHoraTecnico ?? 0)
                      : '—'}
                    {' · '}
                    Custo de Manutenção:{' '}
                    {ordem.custo?.custoManutencao !== undefined
                      ? formatarMoeda(ordem.custo?.custoManutencao)
                      : '—'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOrdemParaLancarCusto(ordem)}
                  className="from-marca-900 to-marca-500 font-display shadow-card hover:shadow-card-hover focus:ring-marca-500 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-all duration-200 hover:brightness-110 focus:ring-2 focus:outline-none active:scale-[0.98]"
                >
                  <CircleDollarSign size={14} />
                  Editar Custos
                </button>
              </div>
            )
          })}
        </div>
      </main>

      {ordemParaLancarCusto && (
        <ModalLancarCustoManutencao
          ordemServico={ordemParaLancarCusto}
          aoFechar={() => setOrdemParaLancarCusto(null)}
          aoSalvar={aoSalvarCusto}
        />
      )}
    </div>
  )
}
