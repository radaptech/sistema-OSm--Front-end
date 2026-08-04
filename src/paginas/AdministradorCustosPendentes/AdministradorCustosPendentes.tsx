import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleDollarSign } from 'lucide-react'
import { toast } from 'react-toastify'
import { CabecalhoSubpagina } from '../../componentes/CabecalhoSubpagina'
import { CampoBusca } from '../../componentes/CampoBusca'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { useLojas } from '../../hooks/useLojas'
import { useOrdensServicoTodas } from '../../hooks/useOrdensServicoTodas'
import { servicoOrdensServico } from '../../servicos/servicoOrdensServico'
import { formatarDataHora } from '../../utilitarios/formatarData'
import { formatarMoeda } from '../../utilitarios/formatarMoeda'
import type { OrdemServico } from '../../tipos/ordemServico'
import { ModalLancarCustoManutencao } from './componentes/ModalLancarCustoManutencao'
import type { DadosLancarCustoManutencao } from './esquemaLancarCustoManutencao'

export function AdministradorCustosPendentes() {
  const queryClient = useQueryClient()
  const [busca, setBusca] = useState('')
  const [filtroLoja, setFiltroLoja] = useState('')
  const [ordemParaLancarCusto, setOrdemParaLancarCusto] = useState<OrdemServico | null>(null)

  const { data: ordensServico = [], isLoading } = useOrdensServicoTodas()
  const { data: lojas = [] } = useLojas()

  const { mutateAsync: lancarCusto } = useMutation({
    mutationFn: servicoOrdensServico.lancarCustoManutencao,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ordens-servico-todas'] }),
  })

  const ordensPendentes = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    return ordensServico.filter((ordem) => {
      const concluidaSemCusto =
        ordem.statusExecucao === 'Concluída' && ordem.custoManutencao === undefined
      const combinaBusca =
        !termo ||
        ordem.maquinaNome.toLowerCase().includes(termo) ||
        ordem.maquinaCodigo.toLowerCase().includes(termo)
      const combinaLoja = !filtroLoja || ordem.lojaId === filtroLoja

      return concluidaSemCusto && combinaBusca && combinaLoja
    })
  }, [ordensServico, busca, filtroLoja])

  async function aoSalvarCusto(dados: DadosLancarCustoManutencao) {
    if (!ordemParaLancarCusto) {
      return
    }

    await lancarCusto({ ordemServicoId: ordemParaLancarCusto.id, ...dados })
    toast.success(`Custo de manutenção lançado para a OS #${ordemParaLancarCusto.id}.`)
    setOrdemParaLancarCusto(null)
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoSubpagina
        contexto="Painel do Administrador"
        titulo="Custos Pendentes"
        Icone={CircleDollarSign}
      />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6 sm:px-8">
        <p className="text-sm text-slate-300">
          OS concluídas pelo Técnico aguardando o lançamento do custo de manutenção
          (peças/nota fiscal).
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
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {isLoading && (
            <p className="py-10 text-center text-sm text-slate-300">Carregando...</p>
          )}

          {!isLoading && ordensPendentes.length === 0 && (
            <p className="rounded-xl bg-white/10 py-10 text-center text-sm text-slate-200">
              Nenhum custo pendente de lançamento.
            </p>
          )}

          {ordensPendentes.map((ordem) => (
            <div
              key={ordem.id}
              className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] text-sm font-bold text-white">
                    #{ordem.id}
                  </span>
                  <span className="font-semibold text-slate-800">{ordem.maquinaNome}</span>
                  <span className="text-sm text-slate-400">· {ordem.maquinaCodigo}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {lojas.find((loja) => loja.id === ordem.lojaId)?.nome ?? ordem.lojaId} ·{' '}
                  {ordem.setor} · Encerrada em{' '}
                  {ordem.dataFim ? formatarDataHora(ordem.dataFim) : '—'}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Custo Hora do Técnico:{' '}
                  {ordem.custoHoraTecnico !== undefined
                    ? formatarMoeda(ordem.custoHoraTecnico)
                    : '—'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOrdemParaLancarCusto(ordem)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition hover:brightness-110"
              >
                <CircleDollarSign size={14} />
                Lançar Custo
              </button>
            </div>
          ))}
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
