import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle2, UserPlus } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Botao } from '../../componentes/Botao'
import { CampoTexto } from '../../componentes/CampoTexto'
import { SeletorPerfil } from '../../componentes/SeletorPerfil'
import { CabecalhoSubpagina } from '../../componentes/CabecalhoSubpagina'
import { servicoUsuarios } from '../../servicos/servicoUsuarios'
import {
  esquemaCadastrarUsuario,
  type DadosCadastrarUsuario,
} from './esquemaCadastrarUsuario'
import { CamposAcesso } from './componentes/CamposAcesso'

export function CadastrarUsuario() {
  const navegar = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DadosCadastrarUsuario>({
    resolver: zodResolver(esquemaCadastrarUsuario),
    defaultValues: {
      nome: '',
      telefone: '',
      email: '',
      senha: '',
      role: 'solicitante',
      lojasIds: [],
      setores: [],
      acessoTotalSetores: false,
      area: undefined,
    },
  })

  const role = useWatch({ control, name: 'role' })
  const lojasIds = useWatch({ control, name: 'lojasIds' })
  const setores = useWatch({ control, name: 'setores' })
  const acessoTotalSetores = useWatch({ control, name: 'acessoTotalSetores' })
  const area = useWatch({ control, name: 'area' })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: servicoUsuarios.cadastrar,
  })

  async function aoEnviar(dados: DadosCadastrarUsuario) {
    await mutateAsync(dados)
    toast.success('Usuário cadastrado com sucesso.')
    reset()
    navegar(-1)
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoSubpagina
        contexto="Painel do Gestor"
        titulo="Cadastrar Usuário"
        Icone={UserPlus}
      />

      <main className="flex flex-1 justify-center px-4 py-8">
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <form
            onSubmit={handleSubmit(aoEnviar)}
            noValidate
            className="flex flex-col gap-5 p-6 sm:p-8"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold tracking-wide text-[#4bae70] uppercase">
                Perfil *
              </span>
              <SeletorPerfil
                perfilSelecionado={role}
                aoSelecionar={(perfil) => {
                  setValue('role', perfil)
                  setValue('lojasIds', [])
                  setValue('setores', [])
                  setValue('acessoTotalSetores', false)
                  setValue('area', undefined)
                }}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <CampoTexto
                rotulo="Nome *"
                variante="claro"
                placeholder="Nome completo"
                mensagemErro={errors.nome?.message}
                {...register('nome')}
              />
              <CampoTexto
                rotulo="Telefone"
                variante="claro"
                placeholder="(00) 00000-0000"
                mensagemErro={errors.telefone?.message}
                {...register('telefone')}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <CampoTexto
                rotulo="E-mail *"
                variante="claro"
                type="email"
                placeholder="usuario@empresa.com"
                mensagemErro={errors.email?.message}
                {...register('email')}
              />
              <CampoTexto
                rotulo="Senha *"
                variante="claro"
                type="password"
                placeholder="Senha de acesso"
                mensagemErro={errors.senha?.message}
                {...register('senha')}
              />
            </div>

            <CamposAcesso
              role={role}
              lojasIds={lojasIds}
              setores={setores}
              acessoTotalSetores={acessoTotalSetores}
              area={area}
              aoAlterarLojas={(lojas) => setValue('lojasIds', lojas, { shouldValidate: true })}
              aoAlterarSetores={(novosSetores) =>
                setValue('setores', novosSetores as DadosCadastrarUsuario['setores'], {
                  shouldValidate: true,
                })
              }
              aoAlternarAcessoTotal={(valor) => {
                setValue('acessoTotalSetores', valor)
                if (valor) {
                  setValue('setores', [])
                }
              }}
              aoAlterarArea={(valor) =>
                setValue('area', valor as DadosCadastrarUsuario['area'], {
                  shouldValidate: true,
                })
              }
              erroLojas={errors.lojasIds?.message}
              erroSetores={errors.setores?.message}
              erroArea={errors.area?.message}
            />

            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
              <div className="flex-1">
                <Botao type="button" variante="secundario" onClick={() => navegar(-1)}>
                  Cancelar
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
