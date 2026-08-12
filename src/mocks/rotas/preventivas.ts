import type { PreventivaListada, PreventivaManutencao } from '../../tipos/maquina'
import { lojas, maquinas, preventivas, type PreventivaInterna } from '../bancoMock'
import { preventivaEstaVencida, sincronizarPreventivasVencidas } from '../regrasMock'
import { atraso, gerarId, responderErro, responderJson, type Rota } from '../utilidadesMock'

function paraPreventivaListada(preventiva: PreventivaInterna): PreventivaListada | null {
  const maquina = maquinas.find((item) => item.id === preventiva.maquinaId)

  if (!maquina) {
    return null
  }

  return {
    id: preventiva.id,
    maquinaId: preventiva.maquinaId,
    descricao: preventiva.descricao,
    intervaloDias: preventiva.intervaloDias,
    proximaData: preventiva.proximaData,
    ativa: preventiva.ativa,
    maquinaNome: maquina.nome,
    setorId: maquina.setorId,
    setorNome: maquina.setorNome,
    lojaId: maquina.lojaId,
    lojaNome: maquina.lojaNome ?? lojas.find((item) => item.id === maquina.lojaId)?.nome,
    vencida: preventivaEstaVencida(preventiva),
  }
}

export const rotasPreventivas: Rota[] = [
  {
    metodo: 'GET',
    padrao: /^\/preventivas$/,
    async tratar({ query }) {
      await atraso()
      sincronizarPreventivasVencidas()

      let lista = preventivas
      const maquinaId = query.get('maquinaId')
      if (maquinaId) {
        lista = lista.filter((preventiva) => preventiva.maquinaId === Number(maquinaId))
      }

      const listadas = lista
        .map(paraPreventivaListada)
        .filter((item): item is PreventivaListada => item !== null)

      return responderJson(listadas)
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/preventivas$/,
    async tratar({ corpo }) {
      await atraso()
      const dados = corpo as PreventivaManutencao
      const maquina = maquinas.find((item) => item.id === dados.maquinaId)

      if (!maquina) {
        return responderErro('Máquina não encontrada.', 404)
      }

      const nova: PreventivaInterna = {
        id: gerarId(preventivas),
        maquinaId: dados.maquinaId,
        descricao: dados.descricao,
        intervaloDias: dados.intervaloDias,
        proximaData: dados.proximaData,
        ativa: dados.ativa,
      }

      preventivas.push(nova)
      return responderJson(paraPreventivaListada(nova), 201)
    },
  },
  {
    metodo: 'PUT',
    padrao: /^\/preventivas\/(\d+)$/,
    async tratar({ params, corpo }) {
      await atraso()
      const preventiva = preventivas.find((item) => item.id === Number(params[0]))

      if (!preventiva) {
        return responderErro('Preventiva não encontrada.', 404)
      }

      const dados = corpo as PreventivaManutencao
      preventiva.descricao = dados.descricao
      preventiva.intervaloDias = dados.intervaloDias
      preventiva.proximaData = dados.proximaData
      preventiva.ativa = dados.ativa

      return responderJson(paraPreventivaListada(preventiva))
    },
  },
  {
    metodo: 'DELETE',
    padrao: /^\/preventivas\/(\d+)$/,
    async tratar({ params }) {
      await atraso()
      const indice = preventivas.findIndex((item) => item.id === Number(params[0]))

      if (indice === -1) {
        return responderErro('Preventiva não encontrada.', 404)
      }

      preventivas.splice(indice, 1)
      return responderJson(null)
    },
  },
]
