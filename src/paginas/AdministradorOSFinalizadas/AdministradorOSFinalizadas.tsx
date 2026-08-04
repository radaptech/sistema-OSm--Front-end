import { useMemo, useState } from 'react'
import { ClipboardCheck, Eye, Printer } from 'lucide-react'
import { CabecalhoSubpagina } from '../../componentes/CabecalhoSubpagina'
import { CampoBusca } from '../../componentes/CampoBusca'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { Paginacao } from '../../componentes/Paginacao'
import { useLojas } from '../../hooks/useLojas'
import { useOrdensServicoTodas } from '../../hooks/useOrdensServicoTodas'
import { formatarDataHora } from '../../utilitarios/formatarData'
import { formatarMoeda } from '../../utilitarios/formatarMoeda'
import type { OrdemServico } from '../../tipos/ordemServico'
import { ModalDetalhesOS } from '../ModalDetalhesOS/ModalDetalhesOS'

const TAMANHO_PAGINA = 10

interface SelecaoOS {
  ordem: OrdemServico
  imprimir: boolean
}

export function AdministradorOSFinalizadas() {
  const [busca, setBusca] = useState('')
  const [filtroLoja, setFiltroLoja] = useState('')
  const [selecao, setSelecao] = useState<SelecaoOS | null>(null)
  const [pagina, setPagina] = useState(1)

  const { data: ordensServico = [], isLoading } = useOrdensServicoTodas()
  const { data: lojas = [] } = useLojas()

  const ordensFinalizadas = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    return ordensServico.filter((ordem) => {
      const completa = ordem.statusExecucao === 'Concluída' && ordem.custoManutencao !== undefined
      const combinaBusca =
        !termo ||
        ordem.maquinaNome.toLowerCase().includes(termo) ||
        ordem.maquinaCodigo.toLowerCase().includes(termo)
      const combinaLoja = !filtroLoja || ordem.lojaId === filtroLoja

      return completa && combinaBusca && combinaLoja
    })
  }, [ordensServico, busca, filtroLoja])

  const chaveFiltros = `${busca}|${filtroLoja}`
  const [chaveFiltrosAnterior, setChaveFiltrosAnterior] = useState(chaveFiltros)
  if (chaveFiltros !== chaveFiltrosAnterior) {
    setChaveFiltrosAnterior(chaveFiltros)
    setPagina(1)
  }

  const totalPaginas = Math.max(1, Math.ceil(ordensFinalizadas.length / TAMANHO_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const ordensPaginadas = ordensFinalizadas.slice(
    (paginaAtual - 1) * TAMANHO_PAGINA,
    paginaAtual * TAMANHO_PAGINA,
  )

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoSubpagina
        contexto="Painel do Administrador"
        titulo="OS Finalizadas"
        Icone={ClipboardCheck}
      />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6 sm:px-8">
        <p className="text-sm text-slate-300">
          Ordens de serviço concluídas e com todos os dados preenchidos, incluindo o custo de
          manutenção já lançado.
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

          {!isLoading && ordensPaginadas.length === 0 && (
            <p className="rounded-xl bg-white/10 py-10 text-center text-sm text-slate-200">
              Nenhuma OS finalizada encontrada.
            </p>
          )}

          {ordensPaginadas.map((ordem) => {
            const custoTotal = (ordem.custoHoraTecnico ?? 0) + (ordem.custoManutencao ?? 0)

            return (
              <div
                key={ordem.id}
                className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] text-sm font-bold text-white">
                      #{ordem.id}
                    </span>
                    <span className="truncate font-semibold text-slate-800">
                      {ordem.maquinaNome}
                    </span>
                    <span className="text-sm text-slate-400">· {ordem.maquinaCodigo}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {lojas.find((loja) => loja.id === ordem.lojaId)?.nome ?? ordem.lojaId} ·{' '}
                    {ordem.setor} · Encerrada em{' '}
                    {ordem.dataFim ? formatarDataHora(ordem.dataFim) : '—'}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-emerald-700">
                    Custo Total: {formatarMoeda(custoTotal)}
                  </p>
                </div>

                <div className="flex gap-2 sm:shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelecao({ ordem, imprimir: false })}
                    aria-label="Visualizar OS"
                    className="flex items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-slate-600 shadow-sm transition hover:bg-slate-200"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelecao({ ordem, imprimir: true })}
                    aria-label="Imprimir OS"
                    className="flex items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-slate-600 shadow-sm transition hover:bg-slate-200"
                  >
                    <Printer size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {totalPaginas > 1 && (
          <Paginacao pagina={paginaAtual} totalPaginas={totalPaginas} aoMudarPagina={setPagina} />
        )}
      </main>

      {selecao && (
        <ModalDetalhesOS
          ordemServico={selecao.ordem}
          autoImprimir={selecao.imprimir}
          aoFechar={() => setSelecao(null)}
        />
      )}
    </div>
  )
}
