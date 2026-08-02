import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Tag } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Botao } from '../../componentes/Botao'
import { CampoTexto } from '../../componentes/CampoTexto'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { CabecalhoSubpagina } from '../../componentes/CabecalhoSubpagina'
import { useLojas } from '../../hooks/useLojas'
import { useSetores } from '../../hooks/useSetores'
import { servicoSetores } from '../../servicos/servicoSetores'
import { esquemaCadastrarSetor, type DadosCadastrarSetor } from './esquemaCadastrarSetor'

export function CadastrarSetor() {
  const navegar = useNavigate()
  const queryClient = useQueryClient()
  const { data: lojas = [] } = useLojas()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DadosCadastrarSetor>({
    resolver: zodResolver(esquemaCadastrarSetor),
    defaultValues: { nome: '', lojaId: '' },
  })

  const lojaId = useWatch({ control, name: 'lojaId' })
  const { data: setoresDaLoja = [] } = useSetores({ lojaId: lojaId || undefined })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: servicoSetores.criar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['setores'] }),
  })

  async function aoEnviar(dados: DadosCadastrarSetor) {
    await mutateAsync(dados)
    toast.success('Setor cadastrado com sucesso.')
    reset({ nome: '', lojaId: dados.lojaId })
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoSubpagina
        contexto="Painel do Gestor"
        titulo="Cadastrar Setor"
        Icone={Tag}
      />

      <main className="flex flex-1 justify-center px-4 py-8">
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <form
            onSubmit={handleSubmit(aoEnviar)}
            noValidate
            className="flex flex-col gap-5 p-6 sm:p-8"
          >
            <p className="text-sm text-slate-500">
              Setores podem se repetir entre lojas diferentes — ex: "Padaria" pode existir
              na Loja 1 e na Loja 2 como cadastros independentes.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <CampoTexto
                rotulo="Nome *"
                variante="claro"
                placeholder="Ex: Rotisseria"
                mensagemErro={errors.nome?.message}
                {...register('nome')}
              />

              <CampoSelecao
                rotulo="Loja *"
                mensagemErro={errors.lojaId?.message}
                {...register('lojaId')}
              >
                <option value="">Selecionar...</option>
                {lojas.map((loja) => (
                  <option key={loja.id} value={loja.id}>
                    {loja.nome}
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
                  disabled={isPending}
                  className="flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  {isPending ? 'Cadastrando...' : 'Cadastrar'}
                </Botao>
              </div>
            </div>

            {lojaId && (
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-5">
                <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Setores já cadastrados nessa loja
                </span>
                {setoresDaLoja.length === 0 ? (
                  <p className="text-sm text-slate-400">Nenhum setor cadastrado ainda.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {setoresDaLoja.map((setor) => (
                      <span
                        key={setor.id}
                        className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        <Tag size={12} />
                        {setor.nome}
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
