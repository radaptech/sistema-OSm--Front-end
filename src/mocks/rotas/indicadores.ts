import { computarIndicadores } from '../regrasMock'
import { atraso, responderJson, type Rota } from '../utilidadesMock'

export const rotasIndicadores: Rota[] = [
  {
    metodo: 'GET',
    padrao: /^\/indicadores\/maquinas\/(\d+)$/,
    async tratar({ params }) {
      await atraso()
      return responderJson(computarIndicadores(Number(params[0])))
    },
  },
]
