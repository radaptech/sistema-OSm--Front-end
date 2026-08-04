import { useEffect, useState } from 'react'
import { CabecalhoPagina } from '../../componentes/CabecalhoPagina'
import { useSolicitacoes } from '../../hooks/useSolicitacoes'
import { Paginacao } from '../../componentes/Paginacao'
import { BarraFiltros, type FiltroStatus } from './componentes/BarraFiltros'
import { CardSolicitacao } from './componentes/CardSolicitacao'

const ATRASO_DEBOUNCE_BUSCA_MS = 400

export function MinhasSolicitacoes() {
  const [buscaInput, setBuscaInput] = useState('')
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<FiltroStatus>('Todos')
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setBusca(buscaInput)
      setPagina(1)
    }, ATRASO_DEBOUNCE_BUSCA_MS)

    return () => clearTimeout(temporizador)
  }, [buscaInput])

  function aoSelecionarFiltro(novoFiltro: FiltroStatus) {
    setFiltro(novoFiltro)
    setPagina(1)
  }

  const { data, isLoading, isError, isFetching } = useSolicitacoes({
    pagina,
    busca: busca || undefined,
    status: filtro === 'Todos' ? undefined : filtro,
  })

  const solicitacoes = data?.dados ?? []

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoPagina titulo="Minhas Solicitações" />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6 sm:px-8">
        <BarraFiltros
          busca={buscaInput}
          aoMudarBusca={setBuscaInput}
          filtroSelecionado={filtro}
          aoSelecionarFiltro={aoSelecionarFiltro}
        />

        {!isLoading && !isError && (
          <p className="text-sm text-slate-300">
            {data?.total ?? 0} solicitação(ões) encontrada(s)
          </p>
        )}

        <div
          className={`flex flex-1 flex-col gap-3 transition-opacity ${
            isFetching ? 'opacity-60' : 'opacity-100'
          }`}
        >
          {isLoading && (
            <p className="py-10 text-center text-sm text-slate-300">
              Carregando solicitações...
            </p>
          )}

          {isError && (
            <p className="rounded-xl bg-white/10 py-10 text-center text-sm text-slate-200">
              Não foi possível carregar as solicitações.
            </p>
          )}

          {!isLoading && !isError && solicitacoes.length === 0 && (
            <p className="rounded-xl bg-white/10 py-10 text-center text-sm text-slate-200">
              Nenhuma solicitação encontrada.
            </p>
          )}

          {solicitacoes.map((solicitacao) => (
            <CardSolicitacao key={solicitacao.id} solicitacao={solicitacao} />
          ))}
        </div>

        {!isLoading && !isError && data && data.totalPaginas > 1 && (
          <Paginacao
            pagina={data.pagina}
            totalPaginas={data.totalPaginas}
            aoMudarPagina={setPagina}
          />
        )}
      </main>

      <footer className="py-4 text-center">
        <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Solicitação OS © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  )
}
