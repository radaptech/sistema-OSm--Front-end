import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Store } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { Botao } from '../../componentes/Botao'
import { CampoTexto } from '../../componentes/CampoTexto'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { CabecalhoSubpagina } from '../../componentes/CabecalhoSubpagina'
import { useEmpresas } from '../../hooks/useEmpresas'
import { useLojas } from '../../hooks/useLojas'
import { servicoLojas } from '../../servicos/servicoLojas'
import { esquemaCadastrarLoja, type DadosCadastrarLoja } from './esquemaCadastrarLoja'

export function CadastrarLoja() {
  const navegar = useNavigate()
  const { id } = useParams<{ id: string }>()
  const emEdicao = Boolean(id)
  const queryClient = useQueryClient()
  const { data: empresas = [] } = useEmpresas()
  const { data: lojas = [] } = useLojas()

  const { data: lojaExistente } = useQuery({
    queryKey: ['loja', id],
    queryFn: () => servicoLojas.obterPorId(Number(id)),
    enabled: emEdicao,
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DadosCadastrarLoja>({
    resolver: zodResolver(esquemaCadastrarLoja),
    defaultValues: { nome: '', empresaId: 0 },
  })

  useEffect(() => {
    if (lojaExistente) {
      reset({ nome: lojaExistente.nome, empresaId: lojaExistente.empresaId })
    }
  }, [lojaExistente, reset])

  const empresaId = useWatch({ control, name: 'empresaId' })

  const { mutateAsync: criar, isPending: criando } = useMutation({
    mutationFn: servicoLojas.criar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lojas'] }),
  })

  const { mutateAsync: atualizar, isPending: atualizando } = useMutation({
    mutationFn: servicoLojas.atualizar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lojas'] }),
  })

  async function aoEnviar(dados: DadosCadastrarLoja) {
    if (emEdicao && id) {
      await atualizar({ id: Number(id), ...dados })
      toast.success('Loja atualizada com sucesso.')
      navegar(-1)
      return
    }

    await criar(dados)
    toast.success('Loja cadastrada com sucesso.')
    reset({ nome: '', empresaId: dados.empresaId })
  }

  const lojasDaEmpresa = lojas.filter((loja) => loja.empresaId === empresaId)
  const isPending = criando || atualizando

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoSubpagina
        contexto="Painel do Administrador"
        titulo={emEdicao ? 'Editar Loja' : 'Cadastrar Loja'}
        Icone={Store}
      />

      <main className="flex flex-1 justify-center px-4 py-8">
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <form
            onSubmit={handleSubmit(aoEnviar)}
            noValidate
            className="flex flex-col gap-5 p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <CampoTexto
                rotulo="Nome *"
                variante="claro"
                placeholder="Ex: Loja 4 - Zona Norte"
                mensagemErro={errors.nome?.message}
                {...register('nome')}
              />

              <CampoSelecao
                rotulo="Empresa *"
                mensagemErro={errors.empresaId?.message}
                {...register('empresaId', { valueAsNumber: true })}
              >
                <option value="">Selecionar...</option>
                {empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.nome}
                  </option>
                ))}
              </CampoSelecao>
            </div>

            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
              <div className="flex-1">
                <Botao type="button" variante="secundario" onClick={() => navegar(-1)}>
                  Voltar
                </Botao>
              </div>
              <div className="flex-1">
                <Botao
                  type="submit"
                  carregando={isPending}
                  className="flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  {emEdicao ? 'Salvar Alterações' : 'Cadastrar'}
                </Botao>
              </div>
            </div>

            {!emEdicao && empresaId && (
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-5">
                <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Lojas já cadastradas dessa empresa
                </span>
                {lojasDaEmpresa.length === 0 ? (
                  <p className="text-sm text-slate-400">Nenhuma loja cadastrada ainda.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {lojasDaEmpresa.map((loja) => (
                      <span
                        key={loja.id}
                        className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        <Store size={12} />
                        {loja.nome}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </main>

      <footer className="py-4 text-center">
        <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Solicitação OS © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  )
}
