import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Botao } from '../../componentes/Botao'
import { CampoTexto } from '../../componentes/CampoTexto'
import { SeletorPerfil } from '../../componentes/SeletorPerfil'
import { useEstadoAutenticacao } from '../../estado/estadoAutenticacao'
import { derivarNomeUsuario } from '../../utilitarios/derivarNomeUsuario'
import { obterEscoposGestorMock } from '../../servicos/dadosMockGestores'
import { obterSetorSolicitanteMock } from '../../servicos/dadosMockSolicitantes'
import { obterTecnicoLogadoMock } from '../../servicos/dadosMockTecnicos'
import { ROTA_POR_PERFIL } from '../../rotas/rotaPorPerfil'
import { esquemaLogin, type DadosLogin } from './esquemaLogin'

export function TelaLogin() {
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const navegar = useNavigate()
  const entrar = useEstadoAutenticacao((estado) => estado.entrar)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DadosLogin>({
    resolver: zodResolver(esquemaLogin),
    defaultValues: { perfil: 'solicitante', email: '', senha: '' },
  })

  const perfilSelecionado = useWatch({ control, name: 'perfil' })

  function aoEnviar(dados: DadosLogin) {
    const opcoesSessao =
      dados.perfil === 'gestor'
        ? { escoposGestor: obterEscoposGestorMock(dados.email) }
        : dados.perfil === 'solicitante'
          ? obterSetorSolicitanteMock(dados.email)
          : dados.perfil === 'tecnico'
            ? { tecnicoId: obterTecnicoLogadoMock(dados.email) }
            : undefined

    entrar(dados.perfil, derivarNomeUsuario(dados.email), opcoesSessao)
    toast.success('Login realizado com sucesso.')
    navegar(ROTA_POR_PERFIL[dados.perfil])
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-[#1f4e2c] to-[#4bae70] p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="p-6 sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#1f4e2c]">
              Solicitação OS
            </h1>
            <p className="mt-1 text-xs font-bold tracking-widest text-[#4bae70] uppercase">
              Login de Acesso
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-1.5">
            <span className="text-xs font-semibold tracking-wide text-[#4bae70] uppercase">
              Perfil
            </span>
            <SeletorPerfil
              perfilSelecionado={perfilSelecionado}
              aoSelecionar={(perfil) => setValue('perfil', perfil)}
            />
          </div>

          <form
            onSubmit={handleSubmit(aoEnviar)}
            noValidate
            className="mt-5 flex flex-col gap-4"
          >
            <CampoTexto
              rotulo="Login"
              variante="claro"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              mensagemErro={errors.email?.message}
              {...register('email')}
            />

            <div className="flex flex-col gap-1">
              <CampoTexto
                rotulo="Senha de Acesso"
                variante="claro"
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="current-password"
                mensagemErro={errors.senha?.message}
                icone={
                  <button
                    type="button"
                    onClick={() => setMostrarSenha((valor) => !valor)}
                    className="text-[#4bae70] hover:text-[#1f4e2c]"
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                {...register('senha')}
              />

              <button
                type="button"
                className="self-end text-xs font-medium text-[#4bae70] hover:text-[#1f4e2c] hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>

            <Botao type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Botao>
          </form>
        </div>

        <div className="border-t border-slate-100 px-6 py-4 text-center sm:px-8">
          <span className="text-[10px] font-semibold tracking-widest text-[#4bae70]/50 uppercase">
            Solicitação OS © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  )
}
