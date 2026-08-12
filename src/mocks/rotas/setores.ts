import type { NovoSetorPayload } from '../../tipos/setor'
import { setores } from '../bancoMock'
import { atraso, gerarId, responderErro, responderJson, type Rota } from '../utilidadesMock'

export const rotasSetores: Rota[] = [
  {
    metodo: 'GET',
    padrao: /^\/setores$/,
    async tratar({ query }) {
      await atraso()
      const lojaId = query.get('lojaId')
      const lista = lojaId ? setores.filter((setor) => setor.lojaId === Number(lojaId)) : setores
      return responderJson(lista)
    },
  },
  {
    metodo: 'GET',
    padrao: /^\/setores\/(\d+)$/,
    async tratar({ params }) {
      await atraso()
      const setor = setores.find((item) => item.id === Number(params[0]))
      return setor ? responderJson(setor) : responderErro('Setor não encontrado.', 404)
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/setores$/,
    async tratar({ corpo }) {
      await atraso()
      const dados = corpo as NovoSetorPayload
      const jaExiste = setores.some(
        (setor) =>
          setor.lojaId === dados.lojaId && setor.nome.toLowerCase() === dados.nome.toLowerCase(),
      )

      if (jaExiste) {
        return responderErro('Já existe um setor com esse nome nessa loja.', 409)
      }

      const novo = { id: gerarId(setores), nome: dados.nome, lojaId: dados.lojaId, ativo: true }
      setores.push(novo)
      return responderJson(novo, 201)
    },
  },
  {
    metodo: 'PUT',
    padrao: /^\/setores\/(\d+)$/,
    async tratar({ params, corpo }) {
      await atraso()
      const setor = setores.find((item) => item.id === Number(params[0]))

      if (!setor) {
        return responderErro('Setor não encontrado.', 404)
      }

      const dados = corpo as NovoSetorPayload
      setor.nome = dados.nome
      setor.lojaId = dados.lojaId
      return responderJson(setor)
    },
  },
  {
    metodo: 'DELETE',
    padrao: /^\/setores\/(\d+)$/,
    async tratar({ params }) {
      await atraso()
      const indice = setores.findIndex((item) => item.id === Number(params[0]))

      if (indice === -1) {
        return responderErro('Setor não encontrado.', 404)
      }

      setores.splice(indice, 1)
      return responderJson(null)
    },
  },
]
