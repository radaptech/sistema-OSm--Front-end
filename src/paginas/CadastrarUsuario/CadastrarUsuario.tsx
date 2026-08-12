import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CheckCircle2, UserPlus } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
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

const VALORES_PADRAO: DadosCadastrarUsuario = {
  nome: '',
  telefone: '',
  email: '',
  senha: '',
  perfil: 'solicitante',
  lojasIds: [],
  setoresIds: [],
  acessoTotalSetores: false,
  area: undefined,
}

export function CadastrarUsuario() {
  const navegar = useNavigate()
  const { id } = useParams<{ id: string }>()
  const emEdicao = Boolean(id)

  const { data: usuarioExistente } = useQuery({
    queryKey: ['usuario', id],
    queryFn: () => servicoUsuarios.obterPorId(Number(id)),
    enabled: emEdicao,
  })

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DadosCadastrarUsuario>({
    resolver: zodResolver(esquemaCadastrarUsuario),
    defaultValues: VALORES_PADRAO,
  })

  useEffect(() => {
    if (!usuarioExistente) {
      return
    }

    reset({
      ...VALORES_PADRAO,
      nome: usuarioExistente.nome,
      telefone: usuarioExistente.telefone ?? '',
      email: usuarioExistente.email,
      perfil: usuarioExistente.perfil,
      lojasIds: usuarioExistente.lojasIds,
      setoresIds: usuarioExistente.setoresIds,
      acessoTotalSetores: usuarioExistente.acessoTotalSetores,
    })
  }, [usuarioExistente, reset])

  const perfil = useWatch({ control, name: 'perfil' })
  const lojasIds = useWatch({ control, name: 'lojasIds' })
  const setoresIds = useWatch({ control, name: 'setoresIds' })
  const acessoTotalSetores = useWatch({ control, name: 'acessoTotalSetores' })
  const area = useWatch({ control, name: 'area' })

  const { mutateAsync: criar, isPending: criando } = useMutation({
    mutationFn: servicoUsuarios.criar,
  })

  const { mutateAsync: atualizar, isPending: atualizando } = useMutation({
    mutationFn: servicoUsuarios.atualizar,
  })

  async function aoEnviar(dados: DadosCadastrarUsuario) {
    if (emEdicao && id) {
      await atualizar({ id: Number(id), ...dados })
      toast.success('Usuário atualizado com sucesso.')
    } else {
      await criar(dados)
      toast.success('Usuário cadastrado com sucesso.')
    }

    reset(VALORES_PADRAO)
    navegar(-1)
  }

  const isPending = criando || atualizando

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoSubpagina
        contexto="Painel do Administrador"
        titulo={emEdicao ? 'Editar Usuário' : 'Cadastrar Usuário'}
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
              <span className="font-mono text-xs font-semibold tracking-wider text-marca-500 uppercase">
                Perfil *
              </span>
              <SeletorPerfil
                perfilSelecionado={perfil}
                aoSelecionar={(perfil) => {
                  setValue('perfil', perfil)
                  setValue('lojasIds', [])
                  setValue('setoresIds', [])
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
              className="border-t border-slate-100 pt-5"
              perfil={perfil}
              lojasIds={lojasIds}
              setoresIds={setoresIds}
              acessoTotalSetores={acessoTotalSetores}
              area={area}
              aoAlterarLojas={(lojas) => setValue('lojasIds', lojas, { shouldValidate: true })}
              aoAlterarSetores={(novosSetores) =>
                setValue('setoresIds', novosSetores, { shouldValidate: true })
              }
              aoAlternarAcessoTotal={(valor) => {
                setValue('acessoTotalSetores', valor)
                if (valor) {
                  setValue('setoresIds', [])
                }
              }}
              aoAlterarArea={(valor) =>
                setValue('area', valor as DadosCadastrarUsuario['area'], {
                  shouldValidate: true,
                })
              }
              erroLojas={errors.lojasIds?.message}
              erroSetores={errors.setoresIds?.message}
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
                  carregando={isPending}
                  className="flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  {emEdicao ? 'Salvar Alterações' : 'Cadastrar'}
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
