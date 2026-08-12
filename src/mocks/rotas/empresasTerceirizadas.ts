import type { NovaEmpresaTerceirizadaPayload } from '../../tipos/empresaTerceirizada'
import { empresasTerceirizadas } from '../bancoMock'
import { atraso, gerarId, responderErro, responderJson, type Rota } from '../utilidadesMock'

export const rotasEmpresasTerceirizadas: Rota[] = [
  {
    metodo: 'GET',
    padrao: /^\/empresas-terceirizadas$/,
    async tratar() {
      await atraso()
      return responderJson(empresasTerceirizadas)
    },
  },
  {
    metodo: 'GET',
    padrao: /^\/empresas-terceirizadas\/(\d+)$/,
    async tratar({ params }) {
      await atraso()
      const empresa = empresasTerceirizadas.find((item) => item.id === Number(params[0]))
      return empresa ? responderJson(empresa) : responderErro('Empresa terceirizada não encontrada.', 404)
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/empresas-terceirizadas$/,
    async tratar({ corpo }) {
      await atraso()
      const dados = corpo as NovaEmpresaTerceirizadaPayload
      const nova = { id: gerarId(empresasTerceirizadas), ...dados }
      empresasTerceirizadas.push(nova)
      return responderJson(nova, 201)
    },
  },
  {
    metodo: 'PUT',
    padrao: /^\/empresas-terceirizadas\/(\d+)$/,
    async tratar({ params, corpo }) {
      await atraso()
      const empresa = empresasTerceirizadas.find((item) => item.id === Number(params[0]))

      if (!empresa) {
        return responderErro('Empresa terceirizada não encontrada.', 404)
      }

      const dados = corpo as NovaEmpresaTerceirizadaPayload
      Object.assign(empresa, dados)
      return responderJson(empresa)
    },
  },
  {
    metodo: 'DELETE',
    padrao: /^\/empresas-terceirizadas\/(\d+)$/,
    async tratar({ params }) {
      await atraso()
      const indice = empresasTerceirizadas.findIndex((item) => item.id === Number(params[0]))

      if (indice === -1) {
        return responderErro('Empresa terceirizada não encontrada.', 404)
      }

      empresasTerceirizadas.splice(indice, 1)
      return responderJson(null)
    },
  },
]
