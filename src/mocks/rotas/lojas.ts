import type { NovaLojaPayload } from '../../tipos/loja'
import { lojas } from '../bancoMock'
import { atraso, gerarId, responderErro, responderJson, type Rota } from '../utilidadesMock'

export const rotasLojas: Rota[] = [
  {
    metodo: 'GET',
    padrao: /^\/lojas$/,
    async tratar() {
      await atraso()
      return responderJson(lojas)
    },
  },
  {
    metodo: 'GET',
    padrao: /^\/lojas\/(\d+)$/,
    async tratar({ params }) {
      await atraso()
      const loja = lojas.find((item) => item.id === Number(params[0]))
      return loja ? responderJson(loja) : responderErro('Loja não encontrada.', 404)
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/lojas$/,
    async tratar({ corpo }) {
      await atraso()
      const dados = corpo as NovaLojaPayload
      const nova = { id: gerarId(lojas), nome: dados.nome, empresaId: dados.empresaId, ativa: true }
      lojas.push(nova)
      return responderJson(nova, 201)
    },
  },
  {
    metodo: 'PUT',
    padrao: /^\/lojas\/(\d+)$/,
    async tratar({ params, corpo }) {
      await atraso()
      const loja = lojas.find((item) => item.id === Number(params[0]))

      if (!loja) {
        return responderErro('Loja não encontrada.', 404)
      }

      const dados = corpo as NovaLojaPayload
      loja.nome = dados.nome
      loja.empresaId = dados.empresaId
      return responderJson(loja)
    },
  },
  {
    metodo: 'DELETE',
    padrao: /^\/lojas\/(\d+)$/,
    async tratar({ params }) {
      await atraso()
      const indice = lojas.findIndex((item) => item.id === Number(params[0]))

      if (indice === -1) {
        return responderErro('Loja não encontrada.', 404)
      }

      lojas.splice(indice, 1)
      return responderJson(null)
    },
  },
]
