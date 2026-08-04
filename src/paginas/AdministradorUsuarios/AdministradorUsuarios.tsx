import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2, UserPlus } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { CabecalhoSubpagina } from '../../componentes/CabecalhoSubpagina'
import { CampoBusca } from '../../componentes/CampoBusca'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { ModalConfirmarExclusao } from '../../componentes/ModalConfirmarExclusao'
import { Paginacao } from '../../componentes/Paginacao'
import { useLojas } from '../../hooks/useLojas'
import { useUsuarios } from '../../hooks/useUsuarios'
import { servicoUsuarios } from '../../servicos/servicoUsuarios'
import type { Usuario } from '../../tipos/usuario'

const ROTULO_PERFIL: Record<Usuario['role'], string> = {
  solicitante: 'Solicitante',
  gestor: 'Gestor',
  administrador: 'Administrador',
}

const TAMANHO_PAGINA = 10

export function AdministradorUsuarios() {
  const navegar = useNavigate()
  const queryClient = useQueryClient()
  const [busca, setBusca] = useState('')
  const [filtroRole, setFiltroRole] = useState<Usuario['role'] | ''>('')
  const [filtroLoja, setFiltroLoja] = useState('')
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(null)
  const [pagina, setPagina] = useState(1)

  const { data: usuarios = [], isLoading } = useUsuarios()
  const { data: lojas = [] } = useLojas()

  const { mutateAsync: excluir, isPending: excluindo } = useMutation({
    mutationFn: servicoUsuarios.deletar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  })

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    return usuarios.filter((usuario) => {
      const combinaBusca =
        !termo ||
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo)
      const combinaRole = !filtroRole || usuario.role === filtroRole
      const combinaLoja = !filtroLoja || usuario.lojasIds.includes(filtroLoja)

      return combinaBusca && combinaRole && combinaLoja
    })
  }, [usuarios, busca, filtroRole, filtroLoja])

  const chaveFiltros = `${busca}|${filtroRole}|${filtroLoja}`
  const [chaveFiltrosAnterior, setChaveFiltrosAnterior] = useState(chaveFiltros)
  if (chaveFiltros !== chaveFiltrosAnterior) {
    setChaveFiltrosAnterior(chaveFiltros)
    setPagina(1)
  }

  const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / TAMANHO_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaAtual - 1) * TAMANHO_PAGINA,
    paginaAtual * TAMANHO_PAGINA,
  )

  async function aoConfirmarExclusao() {
    if (!usuarioParaExcluir) {
      return
    }

    await excluir(usuarioParaExcluir.id)
    toast.success('Usuário excluído com sucesso.')
    setUsuarioParaExcluir(null)
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoSubpagina
        contexto="Painel do Administrador"
        titulo="Usuários"
        Icone={UserPlus}
      />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <CampoBusca
            valor={busca}
            aoMudar={setBusca}
            placeholder="Buscar por nome ou e-mail..."
          />

          <div className="grid grid-cols-2 gap-2 sm:w-96 sm:shrink-0">
            <CampoSelecao
              rotulo="Perfil"
              value={filtroRole}
              onChange={(evento) => setFiltroRole(evento.target.value as Usuario['role'] | '')}
            >
              <option value="">Todos os perfis</option>
              <option value="solicitante">Solicitante</option>
              <option value="gestor">Gestor</option>
              <option value="administrador">Administrador</option>
            </CampoSelecao>

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

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navegar('/cadastrar-usuario')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            <Plus size={16} />
            Novo Usuário
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {isLoading && (
            <p className="py-10 text-center text-sm text-slate-300">Carregando...</p>
          )}

          {!isLoading && usuariosFiltrados.length === 0 && (
            <p className="rounded-xl bg-white/10 py-10 text-center text-sm text-slate-200">
              Nenhum usuário encontrado.
            </p>
          )}

          {usuariosPaginados.map((usuario) => {
            const nomesLojas = usuario.lojasIds
              .map((lojaId) => lojas.find((loja) => loja.id === lojaId)?.nome ?? lojaId)
              .join(', ')

            return (
              <div
                key={usuario.id}
                className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-800">{usuario.nome}</span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {ROTULO_PERFIL[usuario.role]}
                    </span>
                    {usuario.acessoTotalSetores && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Acesso total
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{usuario.email}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {nomesLojas || 'Sem loja vinculada'}
                    {usuario.setores.length > 0 && ` · ${usuario.setores.join(', ')}`}
                  </p>
                </div>

                <div className="flex gap-2 sm:shrink-0">
                  <button
                    type="button"
                    onClick={() => navegar(`/cadastrar-usuario/${usuario.id}`)}
                    aria-label="Editar usuário"
                    className="flex items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-slate-600 shadow-sm transition hover:bg-slate-200"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setUsuarioParaExcluir(usuario)}
                    aria-label="Excluir usuário"
                    className="flex items-center justify-center rounded-xl bg-red-50 px-3.5 py-2.5 text-red-500 shadow-sm transition hover:bg-red-100"
                  >
                    <Trash2 size={16} />
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

      {usuarioParaExcluir && (
        <ModalConfirmarExclusao
          titulo="Excluir Usuário"
          mensagem={`Tem certeza que deseja excluir "${usuarioParaExcluir.nome}"? Essa ação não pode ser desfeita.`}
          confirmando={excluindo}
          aoConfirmar={aoConfirmarExclusao}
          aoFechar={() => setUsuarioParaExcluir(null)}
        />
      )}
    </div>
  )
}
