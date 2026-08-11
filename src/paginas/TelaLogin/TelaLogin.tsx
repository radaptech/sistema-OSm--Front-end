import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Wrench } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Botao } from '../../componentes/Botao'
import { CampoTexto } from '../../componentes/CampoTexto'
import { SeletorPerfil } from '../../componentes/SeletorPerfil'
import { useEstadoAutenticacao } from '../../estado/estadoAutenticacao'
import { servicoAutenticacao } from '../../servicos/servicoAutenticacao'
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

  // O escopo de acesso (loja/setor do solicitante, escopos do gestor, tecnicoId) vem no
  // payload de login — o front não deriva nada disso.
  async function aoEnviar(dados: DadosLogin) {
    const sessao = await servicoAutenticacao.entrar(dados)

    entrar(sessao)
    toast.success('Login realizado com sucesso.')
    navegar(ROTA_POR_PERFIL[sessao.perfil])
  }

  return (
    <div className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-gradient-to-br from-marca-950 via-marca-800 to-marca-500 p-4">
      <div className="bg-grade-industrial bg-grade pointer-events-none absolute inset-0 opacity-[0.12]" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-marca-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-marca-500/30 blur-3xl" />

      <div className="animate-pop-in relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-pop">
        <div className="p-6 sm:p-8">
          <div className="text-center">
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-marca-900 to-marca-500 shadow-card">
              <Wrench className="text-white" size={22} />
            </span>
            <h1 className="font-display text-2xl font-bold text-marca-800">
              Solicitação OS
            </h1>
            <p className="mt-1 font-mono text-xs font-bold tracking-widest text-marca-500 uppercase">
              Login de Acesso
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-1.5">
            <span className="font-mono text-xs font-semibold tracking-wider text-marca-500 uppercase">
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
                    className="text-marca-500 transition hover:text-marca-800"
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                {...register('senha')}
              />

              <button
                type="button"
                className="self-end text-xs font-medium text-marca-500 transition hover:text-marca-800 hover:underline"
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
          <span className="font-mono text-[10px] font-semibold tracking-widest text-marca-500/50 uppercase">
            Solicitação OS © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  )
}
