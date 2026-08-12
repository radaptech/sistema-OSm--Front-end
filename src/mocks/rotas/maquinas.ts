import type { AtualizarMaquinaPayload, Maquina, NovaMaquinaPayload } from '../../tipos/maquina'
import { lojas, maquinas, preventivas, setores, type PreventivaInterna } from '../bancoMock'
import {
  atraso,
  extrairCorpo,
  gerarId,
  marcadorFoto,
  responderErro,
  responderJson,
  urlArquivoEnviado,
  type Rota,
} from '../utilidadesMock'

function gravarPreventivas(maquinaId: number, itens: NovaMaquinaPayload['preventivas']): void {
  for (let indice = preventivas.length - 1; indice >= 0; indice -= 1) {
    if (preventivas[indice].maquinaId === maquinaId) {
      preventivas.splice(indice, 1)
    }
  }

  for (const item of itens) {
    const nova: PreventivaInterna = {
      id: gerarId(preventivas),
      maquinaId,
      descricao: item.descricao,
      intervaloDias: item.intervaloDias,
      proximaData: item.proximaData,
      ativa: item.ativa,
    }
    preventivas.push(nova)
  }
}

export const rotasMaquinas: Rota[] = [
  {
    metodo: 'GET',
    padrao: /^\/maquinas$/,
    async tratar({ query }) {
      await atraso()
      let lista = maquinas

      const setorId = query.get('setorId')
      if (setorId) {
        lista = lista.filter((maquina) => maquina.setorId === Number(setorId))
      }

      const lojaId = query.get('lojaId')
      if (lojaId) {
        lista = lista.filter((maquina) => maquina.lojaId === Number(lojaId))
      }

      return responderJson(lista)
    },
  },
  {
    metodo: 'GET',
    padrao: /^\/maquinas\/(\d+)$/,
    async tratar({ params }) {
      await atraso()
      const maquina = maquinas.find((item) => item.id === Number(params[0]))
      return maquina ? responderJson(maquina) : responderErro('Máquina não encontrada.', 404)
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/maquinas$/,
    async tratar({ corpo }) {
      await atraso()
      const { dados, arquivos } = extrairCorpo(corpo)
      const payload = dados as unknown as NovaMaquinaPayload

      if (!payload.preventivas || payload.preventivas.length === 0) {
        return responderErro('Cadastre ao menos uma manutenção preventiva.', 400)
      }

      const setor = setores.find((item) => item.id === payload.setorId)
      if (!setor) {
        return responderErro('Setor não encontrado.', 404)
      }

      const nova: Maquina = {
        id: gerarId(maquinas),
        nome: payload.nome,
        numeroPatrimonio: payload.numeroPatrimonio,
        serie: payload.serie,
        descricao: payload.descricao,
        marca: payload.marca,
        modelo: payload.modelo,
        criticidade: payload.criticidade,
        setorId: setor.id,
        setorNome: setor.nome,
        lojaId: setor.lojaId,
        lojaNome: lojas.find((item) => item.id === setor.lojaId)?.nome,
        fotoUrl: urlArquivoEnviado(arquivos, 'foto') ?? marcadorFoto(payload.nome),
      }

      maquinas.push(nova)
      gravarPreventivas(nova.id, payload.preventivas)

      return responderJson(nova, 201)
    },
  },
  {
    metodo: 'PUT',
    padrao: /^\/maquinas\/(\d+)$/,
    async tratar({ params, corpo }) {
      await atraso()
      const maquina = maquinas.find((item) => item.id === Number(params[0]))

      if (!maquina) {
        return responderErro('Máquina não encontrada.', 404)
      }

      const { dados, arquivos } = extrairCorpo(corpo)
      const payload = dados as unknown as AtualizarMaquinaPayload

      if (!payload.preventivas || payload.preventivas.length === 0) {
        return responderErro('Cadastre ao menos uma manutenção preventiva.', 400)
      }

      const setor = setores.find((item) => item.id === payload.setorId)
      if (!setor) {
        return responderErro('Setor não encontrado.', 404)
      }

      maquina.nome = payload.nome
      maquina.numeroPatrimonio = payload.numeroPatrimonio
      maquina.serie = payload.serie
      maquina.descricao = payload.descricao
      maquina.marca = payload.marca
      maquina.modelo = payload.modelo
      maquina.criticidade = payload.criticidade
      maquina.setorId = setor.id
      maquina.setorNome = setor.nome
      maquina.lojaId = setor.lojaId
      maquina.lojaNome = lojas.find((item) => item.id === setor.lojaId)?.nome

      const fotoUrl = urlArquivoEnviado(arquivos, 'foto')
      if (fotoUrl) {
        maquina.fotoUrl = fotoUrl
      }

      gravarPreventivas(maquina.id, payload.preventivas)

      return responderJson(maquina)
    },
  },
  {
    metodo: 'DELETE',
    padrao: /^\/maquinas\/(\d+)$/,
    async tratar({ params }) {
      await atraso()
      const id = Number(params[0])
      const indice = maquinas.findIndex((item) => item.id === id)

      if (indice === -1) {
        return responderErro('Máquina não encontrada.', 404)
      }

      maquinas.splice(indice, 1)

      for (let i = preventivas.length - 1; i >= 0; i -= 1) {
        if (preventivas[i].maquinaId === id) {
          preventivas.splice(i, 1)
        }
      }

      return responderJson(null)
    },
  },
]
