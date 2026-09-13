import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { Botao } from '../../componentes/Botao'
import { CampoTexto } from '../../componentes/CampoTexto'
import { CartaoAutenticacao } from '../../componentes/CartaoAutenticacao'
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
    formState: { errors, isSubmitting },
  } = useForm<DadosLogin>({
    resolver: zodResolver(esquemaLogin),
    defaultValues: { email: '', senha: '' },
  })

  // O perfil e o escopo de acesso (loja/setor do solicitante, escopos do gestor,
  // tecnicoId) vêm no payload de login — o front não deriva nem escolhe nada disso, e é
  // `sessao.perfil` que decide para onde navegar logo abaixo.
  async function aoEnviar(dados: DadosLogin) {
    const sessao = await servicoAutenticacao.entrar(dados)

    entrar(sessao)
    toast.success('Login realizado com sucesso.')
    navegar(ROTA_POR_PERFIL[sessao.perfil])
  }

  return (
    <CartaoAutenticacao subtitulo="Login de Acesso">
      <form
        onSubmit={handleSubmit(aoEnviar)}
        noValidate
        className="mt-6 flex flex-col gap-4"
      >
        <CampoTexto
          rotulo="Login"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          mensagemErro={errors.email?.message}
          {...register('email')}
        />

        <div className="flex flex-col gap-1">
          <CampoTexto
            rotulo="Senha de Acesso"
            type={mostrarSenha ? 'text' : 'password'}
            autoComplete="current-password"
            mensagemErro={errors.senha?.message}
            icone={
              <button
                type="button"
                onClick={() => setMostrarSenha((valor) => !valor)}
                className="text-marca-500 hover:text-marca-800 transition"
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            {...register('senha')}
          />

          <Link
            to="/esqueci-senha"
            className="text-marca-500 hover:text-marca-800 self-end text-xs font-medium transition hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>

        <Botao type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Botao>
      </form>
    </CartaoAutenticacao>
  )
}
