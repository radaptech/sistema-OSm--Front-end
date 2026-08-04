import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2, Wrench } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { CabecalhoSubpagina } from '../../componentes/CabecalhoSubpagina'
import { CampoBusca } from '../../componentes/CampoBusca'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { ModalConfirmarExclusao } from '../../componentes/ModalConfirmarExclusao'
import { Paginacao } from '../../componentes/Paginacao'
import { useLojas } from '../../hooks/useLojas'
import { useMaquinas } from '../../hooks/useMaquinas'
import { servicoMaquinas } from '../../servicos/servicoMaquinas'
import { setoresDisponiveis, type Maquina, type Setor } from '../../tipos/maquina'

const TAMANHO_PAGINA = 10

export function AdministradorMaquinas() {
  const navegar = useNavigate()
  const queryClient = useQueryClient()
  const [busca, setBusca] = useState('')
  const [filtroLoja, setFiltroLoja] = useState('')
  const [filtroSetor, setFiltroSetor] = useState<Setor | ''>('')
  const [maquinaParaExcluir, setMaquinaParaExcluir] = useState<Maquina | null>(null)
  const [pagina, setPagina] = useState(1)

  const { data: maquinas = [], isLoading } = useMaquinas({
    lojaId: filtroLoja || undefined,
    setor: filtroSetor || undefined,
  })
  const { data: lojas = [] } = useLojas()

  const { mutateAsync: excluir, isPending: excluindo } = useMutation({
    mutationFn: servicoMaquinas.deletar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maquinas'] }),
  })

  const maquinasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return maquinas.filter(
      (maquina) =>
        !termo ||
        maquina.nome.toLowerCase().includes(termo) ||
        maquina.id.toLowerCase().includes(termo),
    )
  }, [maquinas, busca])

  const chaveFiltros = `${busca}|${filtroLoja}|${filtroSetor}`
  const [chaveFiltrosAnterior, setChaveFiltrosAnterior] = useState(chaveFiltros)
  if (chaveFiltros !== chaveFiltrosAnterior) {
    setChaveFiltrosAnterior(chaveFiltros)
    setPagina(1)
  }

  const totalPaginas = Math.max(1, Math.ceil(maquinasFiltradas.length / TAMANHO_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const maquinasPaginadas = maquinasFiltradas.slice(
    (paginaAtual - 1) * TAMANHO_PAGINA,
    paginaAtual * TAMANHO_PAGINA,
  )

  async function aoConfirmarExclusao() {
    if (!maquinaParaExcluir) {
      return
    }

    await excluir(maquinaParaExcluir.id)
    toast.success('Máquina excluída com sucesso.')
    setMaquinaParaExcluir(null)
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoSubpagina contexto="Painel do Administrador" titulo="Máquinas" Icone={Wrench} />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <CampoBusca valor={busca} aoMudar={setBusca} placeholder="Buscar por nome ou código..." />

          <div className="grid grid-cols-2 gap-2 sm:w-96 sm:shrink-0">
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

            <CampoSelecao
              rotulo="Setor"
              value={filtroSetor}
              onChange={(evento) => setFiltroSetor(evento.target.value as Setor | '')}
            >
              <option value="">Todos os setores</option>
              {setoresDisponiveis.map((setor) => (
                <option key={setor} value={setor}>
                  {setor}
                </option>
              ))}
            </CampoSelecao>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navegar('/cadastrar-maquina')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            <Plus size={16} />
            Nova Máquina
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {isLoading && (
            <p className="py-10 text-center text-sm text-slate-300">Carregando...</p>
          )}

          {!isLoading && maquinasFiltradas.length === 0 && (
            <p className="rounded-xl bg-white/10 py-10 text-center text-sm text-slate-200">
              Nenhuma máquina encontrada.
            </p>
          )}

          {maquinasPaginadas.map((maquina) => (
            <div
              key={maquina.id}
              className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                {maquina.fotoUrl ? (
                  <img
                    src={maquina.fotoUrl}
                    alt={maquina.nome}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] text-white">
                    <Wrench size={16} />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-800">
                    {maquina.nome} <span className="text-sm text-slate-400">· {maquina.id}</span>
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {lojas.find((loja) => loja.id === maquina.lojaId)?.nome ?? maquina.lojaId} ·{' '}
                    {maquina.setor}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 sm:shrink-0">
                <button
                  type="button"
                  onClick={() => navegar(`/cadastrar-maquina/${maquina.id}`)}
                  aria-label="Editar máquina"
                  className="flex items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-slate-600 shadow-sm transition hover:bg-slate-200"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setMaquinaParaExcluir(maquina)}
                  aria-label="Excluir máquina"
                  className="flex items-center justify-center rounded-xl bg-red-50 px-3.5 py-2.5 text-red-500 shadow-sm transition hover:bg-red-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalPaginas > 1 && (
          <Paginacao pagina={paginaAtual} totalPaginas={totalPaginas} aoMudarPagina={setPagina} />
        )}
      </main>

      {maquinaParaExcluir && (
        <ModalConfirmarExclusao
          titulo="Excluir Máquina"
          mensagem={`Tem certeza que deseja excluir "${maquinaParaExcluir.nome}"? Essa ação não pode ser desfeita.`}
          confirmando={excluindo}
          aoConfirmar={aoConfirmarExclusao}
          aoFechar={() => setMaquinaParaExcluir(null)}
        />
      )}
    </div>
  )
}
