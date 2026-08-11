import { useState } from 'react'
import { ClipboardCheck, Eye, Printer } from 'lucide-react'
import { CabecalhoSubpagina } from '../../componentes/CabecalhoSubpagina'
import { BadgeTipoOS } from '../../componentes/BadgeTipoOS'
import { CampoBusca } from '../../componentes/CampoBusca'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { FiltroTipoOS } from '../../componentes/FiltroTipoOS'
import { Paginacao } from '../../componentes/Paginacao'
import { useLojas } from '../../hooks/useLojas'
import { useOrdensServicoTodas } from '../../hooks/useOrdensServicoTodas'
import { formatarDataHora } from '../../utilitarios/formatarData'
import { formatarMoeda } from '../../utilitarios/formatarMoeda'
import type { OrdemServico, TipoOS } from '../../tipos/ordemServico'
import { ModalDetalhesOS } from '../ModalDetalhesOS/ModalDetalhesOS'

const TAMANHO_PAGINA = 10

interface SelecaoOS {
  ordem: OrdemServico
  imprimir: boolean
}

export function AdministradorOSFinalizadas() {
  const [busca, setBusca] = useState('')
  const [filtroLoja, setFiltroLoja] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<TipoOS | ''>('')
  const [selecao, setSelecao] = useState<SelecaoOS | null>(null)
  const [pagina, setPagina] = useState(1)

  // "Finalizada" = Técnico encerrou E o custo foi lançado. O servidor resolve essa regra.
  const { data: ordensServico = [], isLoading } = useOrdensServicoTodas({
    finalizada: true,
    busca: busca.trim() || undefined,
    lojaId: filtroLoja ? Number(filtroLoja) : undefined,
    tipo: filtroTipo || undefined,
  })
  const { data: lojas = [] } = useLojas()

  const ordensFinalizadas = ordensServico

  const chaveFiltros = `${busca}|${filtroLoja}|${filtroTipo}`
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

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6 sm:px-8 lg:max-w-6xl">
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

          {!isLoading && ordensPaginadas.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white/10 py-12 text-slate-400 lg:col-span-2">
              <ClipboardCheck size={28} />
              <p className="text-sm">Nenhuma OS finalizada encontrada para esses filtros.</p>
            </div>
          )}

          {ordensPaginadas.map((ordem) => {
            const custoTotal = (ordem.custo?.custoHoraTecnico ?? 0) + (ordem.custo?.custoManutencao ?? 0)

            return (
              <div
                key={ordem.id}
                className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-card transition-shadow duration-200 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between lg:[&:last-child:nth-child(odd)]:col-span-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-marca-900 to-marca-500 font-mono text-sm font-bold text-white">
                      #{ordem.id}
                    </span>
                    <span className="truncate font-semibold text-slate-800">
                      {ordem.maquinaNome}
                    </span>
                    <span className="font-mono text-sm text-slate-400">
                      · {ordem.maquinaCodigo}
                    </span>
                    <BadgeTipoOS tipo={ordem.tipo} />
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {lojas.find((loja) => loja.id === ordem.lojaId)?.nome ?? ordem.lojaId} ·{' '}
                    {ordem.setorNome} · Encerrada em{' '}
                    {ordem.dataFim ? formatarDataHora(ordem.dataFim) : '—'}
                  </p>
                  <p className="mt-1 font-mono text-xs font-semibold text-emerald-700">
                    Custo Total: {formatarMoeda(custoTotal)}
                  </p>
                </div>

                <div className="flex gap-2 sm:shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelecao({ ordem, imprimir: false })}
                    aria-label="Visualizar OS"
                    className="flex items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-slate-600 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-marca-500"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelecao({ ordem, imprimir: true })}
                    aria-label="Imprimir OS"
                    className="flex items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-slate-600 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-marca-500"
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
