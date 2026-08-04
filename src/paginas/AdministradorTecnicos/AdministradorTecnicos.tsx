import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2, Wrench } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { CabecalhoSubpagina } from '../../componentes/CabecalhoSubpagina'
import { CampoBusca } from '../../componentes/CampoBusca'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { ModalConfirmarExclusao } from '../../componentes/ModalConfirmarExclusao'
import { Paginacao } from '../../componentes/Paginacao'
import { useLojas } from '../../hooks/useLojas'
import { useTecnicos } from '../../hooks/useTecnicos'
import { servicoTecnicos } from '../../servicos/servicoTecnicos'
import { formatarMoeda } from '../../utilitarios/formatarMoeda'
import type { Tecnico } from '../../tipos/tecnico'
import { ModalEditarTecnico } from './componentes/ModalEditarTecnico'
import type { DadosEditarTecnico } from './esquemaEditarTecnico'

const TAMANHO_PAGINA = 10

export function AdministradorTecnicos() {
  const navegar = useNavigate()
  const queryClient = useQueryClient()
  const [busca, setBusca] = useState('')
  const [filtroLoja, setFiltroLoja] = useState('')
  const [tecnicoParaEditar, setTecnicoParaEditar] = useState<Tecnico | null>(null)
  const [tecnicoParaExcluir, setTecnicoParaExcluir] = useState<Tecnico | null>(null)
  const [pagina, setPagina] = useState(1)

  const { data: tecnicos = [], isLoading } = useTecnicos({ lojaId: filtroLoja || undefined })
  const { data: lojas = [] } = useLojas()

  const { mutateAsync: atualizar } = useMutation({
    mutationFn: servicoTecnicos.atualizar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tecnicos'] }),
  })

  const { mutateAsync: excluir, isPending: excluindo } = useMutation({
    mutationFn: servicoTecnicos.deletar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tecnicos'] }),
  })

  const tecnicosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return tecnicos.filter(
      (tecnico) =>
        !termo ||
        tecnico.nome.toLowerCase().includes(termo) ||
        tecnico.email.toLowerCase().includes(termo),
    )
  }, [tecnicos, busca])

  const chaveFiltros = `${busca}|${filtroLoja}`
  const [chaveFiltrosAnterior, setChaveFiltrosAnterior] = useState(chaveFiltros)
  if (chaveFiltros !== chaveFiltrosAnterior) {
    setChaveFiltrosAnterior(chaveFiltros)
    setPagina(1)
  }

  const totalPaginas = Math.max(1, Math.ceil(tecnicosFiltrados.length / TAMANHO_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const tecnicosPaginados = tecnicosFiltrados.slice(
    (paginaAtual - 1) * TAMANHO_PAGINA,
    paginaAtual * TAMANHO_PAGINA,
  )

  async function aoSalvarEdicao(dados: DadosEditarTecnico) {
    if (!tecnicoParaEditar) {
      return
    }

    await atualizar({ id: tecnicoParaEditar.id, ...dados })
    toast.success('Técnico atualizado com sucesso.')
    setTecnicoParaEditar(null)
  }

  async function aoConfirmarExclusao() {
    if (!tecnicoParaExcluir) {
      return
    }

    await excluir(tecnicoParaExcluir.id)
    toast.success('Técnico excluído com sucesso.')
    setTecnicoParaExcluir(null)
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoSubpagina contexto="Painel do Administrador" titulo="Técnicos" Icone={Wrench} />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <CampoBusca valor={busca} aoMudar={setBusca} placeholder="Buscar por nome ou e-mail..." />

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

          <button
            type="button"
            onClick={() => navegar('/cadastrar-usuario')}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            <Wrench size={16} />
            Novo Técnico
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {isLoading && (
            <p className="py-10 text-center text-sm text-slate-300">Carregando...</p>
          )}

          {!isLoading && tecnicosFiltrados.length === 0 && (
            <p className="rounded-xl bg-white/10 py-10 text-center text-sm text-slate-200">
              Nenhum técnico encontrado.
            </p>
          )}

          {tecnicosPaginados.map((tecnico) => (
            <div
              key={tecnico.id}
              className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-800">{tecnico.nome}</span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {tecnico.area}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {formatarMoeda(tecnico.valorHora)}/h
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{tecnico.email}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {tecnico.lojasIds
                    .map((lojaId) => lojas.find((loja) => loja.id === lojaId)?.nome ?? lojaId)
                    .join(', ')}
                </p>
              </div>

              <div className="flex gap-2 sm:shrink-0">
                <button
                  type="button"
                  onClick={() => setTecnicoParaEditar(tecnico)}
                  aria-label="Editar técnico"
                  className="flex items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-slate-600 shadow-sm transition hover:bg-slate-200"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setTecnicoParaExcluir(tecnico)}
                  aria-label="Excluir técnico"
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

      {tecnicoParaEditar && (
        <ModalEditarTecnico
          tecnico={tecnicoParaEditar}
          aoFechar={() => setTecnicoParaEditar(null)}
          aoSalvar={aoSalvarEdicao}
        />
      )}

      {tecnicoParaExcluir && (
        <ModalConfirmarExclusao
          titulo="Excluir Técnico"
          mensagem={`Tem certeza que deseja excluir "${tecnicoParaExcluir.nome}"? Essa ação não pode ser desfeita.`}
          confirmando={excluindo}
          aoConfirmar={aoConfirmarExclusao}
          aoFechar={() => setTecnicoParaExcluir(null)}
        />
      )}
    </div>
  )
}
