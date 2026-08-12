import type { CredenciaisLogin } from '../../tipos/autenticacao'
import { obterUsuarioSessao, usuarios } from '../bancoMock'
import { construirSessao } from '../regrasMock'
import { atraso, definirIdSessao, responderErro, responderJson, type Rota } from '../utilidadesMock'

export const rotasAutenticacao: Rota[] = [
  {
    metodo: 'POST',
    padrao: /^\/autenticacao\/login$/,
    async tratar({ corpo }) {
      await atraso()
      const credenciais = corpo as CredenciaisLogin

      const usuario = usuarios.find(
        (item) =>
          item.ativo &&
          item.perfil === credenciais.perfil &&
          item.email.toLowerCase() === credenciais.email?.toLowerCase() &&
          item.senha === credenciais.senha,
      )

      if (!usuario) {
        return responderErro('E-mail, senha ou perfil inválidos.', 401)
      }

      definirIdSessao(usuario.id)
      return responderJson(construirSessao(usuario))
    },
  },
  {
    metodo: 'GET',
    padrao: /^\/autenticacao\/sessao$/,
    async tratar() {
      await atraso()
      const usuario = obterUsuarioSessao()

      if (!usuario) {
        return responderErro('Não autenticado.', 401)
      }

      return responderJson(construirSessao(usuario))
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/autenticacao\/logout$/,
    async tratar() {
      await atraso()
      definirIdSessao(null)
      return responderJson(null)
    },
  },
]
