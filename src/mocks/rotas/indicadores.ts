import { obterUsuarioSessao } from '../bancoMock'
import {
  computarIndicadores,
  computarIndicadoresLoja,
  construirEscoposGestor,
} from '../regrasMock'
import {
  atraso,
  responderErro,
  responderJson,
  type Rota,
} from '../utilidadesMock'

export const rotasIndicadores: Rota[] = [
  {
    metodo: 'GET',
    padrao: /^\/indicadores\/maquinas\/(\d+)$/,
    async tratar({ params }) {
      await atraso()
      return responderJson(computarIndicadores(Number(params[0])))
    },
  },
  {
    metodo: 'GET',
    padrao: /^\/indicadores\/lojas\/(\d+)$/,
    async tratar({ params }) {
      await atraso()
      const usuario = obterUsuarioSessao()
      if (!usuario) {
        return responderErro('Não autenticado.', 401)
      }
      // Loja fora do escopo é 404, como no servidor — não um painel zerado.
      const lojaId = Number(params[0])
      if (
        usuario.perfil !== 'administrador' &&
        !construirEscoposGestor(usuario).some(
          (escopo) => escopo.lojaId === lojaId,
        )
      ) {
        return responderErro('Loja não encontrada.', 404)
      }
      return responderJson(computarIndicadoresLoja(lojaId, usuario))
    },
  },
]
