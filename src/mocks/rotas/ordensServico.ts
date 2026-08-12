import { agoraParaBackend, converterDataBackend } from '../../utilitarios/dataBackend'
import type {
  AcionamentoTerceiroPayload,
  EncerramentoOrdemServicoPayload,
  LancamentoCustoManutencaoPayload,
  OrdemServico,
  PausaOrdemServico,
  StatusExecucaoOS,
  StatusRetomavel,
} from '../../tipos/ordemServico'
import { empresasTerceirizadas, obterUsuarioSessao, ordensServico } from '../bancoMock'
import {
  calcularFinalizada,
  calcularHorasParada,
  calcularHorasTrabalhadas,
  construirEscoposGestor,
  gestorTemAcesso,
} from '../regrasMock'
import { atraso, gerarId, responderBlob, responderErro, responderJson, type Rota } from '../utilidadesMock'

function gerarIdPausa(): number {
  return gerarId(ordensServico.flatMap((ordem) => ordem.pausas ?? []))
}

function ordenarPorAberturaDesc(lista: OrdemServico[]): OrdemServico[] {
  return [...lista].sort(
    (a, b) => converterDataBackend(b.dataAbertura).getTime() - converterDataBackend(a.dataAbertura).getTime(),
  )
}

export const rotasOrdensServico: Rota[] = [
  {
    metodo: 'GET',
    padrao: /^\/ordens-servico$/,
    async tratar({ query }) {
      await atraso()
      const usuario = obterUsuarioSessao()
      if (!usuario) {
        return responderErro('Não autenticado.', 401)
      }

      let lista = [...ordensServico]

      if (usuario.perfil === 'gestor') {
        const escopos = construirEscoposGestor(usuario)
        lista = lista.filter((ordem) => gestorTemAcesso(escopos, ordem.lojaId, ordem.setorId))
      } else if (usuario.perfil === 'tecnico') {
        lista = lista.filter((ordem) => ordem.tecnicoId === usuario.id)
      }

      const status = query.get('status')
      if (status) {
        const statusLista = status.split(',') as StatusExecucaoOS[]
        lista = lista.filter((ordem) => statusLista.includes(ordem.statusExecucao))
      }

      const finalizada = query.get('finalizada')
      if (finalizada) {
        lista = lista.filter((ordem) => ordem.finalizada === (finalizada === 'true'))
      }

      const tipo = query.get('tipo')
      if (tipo) {
        lista = lista.filter((ordem) => ordem.tipo === tipo)
      }

      const lojaId = query.get('lojaId')
      if (lojaId) {
        lista = lista.filter((ordem) => ordem.lojaId === Number(lojaId))
      }

      const tecnicoId = query.get('tecnicoId')
      if (tecnicoId) {
        lista = lista.filter((ordem) => ordem.tecnicoId === Number(tecnicoId))
      }

      const busca = query.get('busca')
      if (busca) {
        const termo = busca.toLowerCase()
        lista = lista.filter((ordem) => {
          const alvo = ordem.maquinaNome ?? ordem.itemDescricao ?? ''
          return (
            ordem.descricao.toLowerCase().includes(termo) ||
            alvo.toLowerCase().includes(termo) ||
            (ordem.solicitanteNome ?? '').toLowerCase().includes(termo)
          )
        })
      }

      return responderJson(ordenarPorAberturaDesc(lista))
    },
  },
  {
    metodo: 'GET',
    padrao: /^\/ordens-servico\/(\d+)$/,
    async tratar({ params }) {
      await atraso()
      const ordem = ordensServico.find((item) => item.id === Number(params[0]))
      return ordem ? responderJson(ordem) : responderErro('Ordem de serviço não encontrada.', 404)
    },
  },
  {
    metodo: 'GET',
    padrao: /^\/ordens-servico\/(\d+)\/impressao$/,
    async tratar({ params }) {
      await atraso()
      const ordem = ordensServico.find((item) => item.id === Number(params[0]))

      if (!ordem) {
        return responderErro('Ordem de serviço não encontrada.', 404)
      }

      const conteudo = `%PDF-1.4\n% Impressão simulada (modo mock) da OS #${ordem.id}.\n`
      return responderBlob(new Blob([conteudo], { type: 'application/pdf' }))
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/ordens-servico\/(\d+)\/iniciar$/,
    async tratar({ params }) {
      await atraso()
      const ordem = ordensServico.find((item) => item.id === Number(params[0]))

      if (!ordem) {
        return responderErro('Ordem de serviço não encontrada.', 404)
      }

      if (ordem.statusExecucao !== 'Aberta') {
        return responderErro('A OS já foi iniciada.', 409)
      }

      ordem.dataInicio = agoraParaBackend()
      ordem.statusExecucao = 'Em Andamento'

      return responderJson(ordem)
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/ordens-servico\/(\d+)\/pausar$/,
    async tratar({ params, corpo }) {
      await atraso()
      const ordem = ordensServico.find((item) => item.id === Number(params[0]))

      if (!ordem) {
        return responderErro('Ordem de serviço não encontrada.', 404)
      }

      if (ordem.statusExecucao !== 'Aberta' && ordem.statusExecucao !== 'Em Andamento') {
        return responderErro('A OS não pode ser pausada nesse status.', 409)
      }

      const dados = corpo as { motivo: string }
      const statusAnterior = ordem.statusExecucao as StatusRetomavel

      const pausa: PausaOrdemServico = {
        id: gerarIdPausa(),
        motivo: dados.motivo,
        pausadaEm: agoraParaBackend(),
        retomadaEm: null,
        statusAnterior,
      }

      ordem.pausaAtual = pausa
      ordem.pausas = [...(ordem.pausas ?? []), pausa]
      ordem.statusExecucao = 'Pausada'

      return responderJson(ordem)
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/ordens-servico\/(\d+)\/retomar$/,
    async tratar({ params }) {
      await atraso()
      const ordem = ordensServico.find((item) => item.id === Number(params[0]))

      if (!ordem || !ordem.pausaAtual) {
        return responderErro('A OS não está pausada.', 409)
      }

      ordem.pausaAtual.retomadaEm = agoraParaBackend()
      ordem.statusExecucao = ordem.pausaAtual.statusAnterior
      ordem.pausaAtual = undefined

      return responderJson(ordem)
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/ordens-servico\/(\d+)\/acionar-terceiro$/,
    async tratar({ params, corpo }) {
      await atraso()
      const ordem = ordensServico.find((item) => item.id === Number(params[0]))

      if (!ordem) {
        return responderErro('Ordem de serviço não encontrada.', 404)
      }

      if (ordem.statusExecucao === 'Concluída') {
        return responderErro('A OS já foi encerrada.', 409)
      }

      const dados = corpo as Omit<AcionamentoTerceiroPayload, 'ordemServicoId'>
      const empresa = empresasTerceirizadas.find((item) => item.id === dados.empresaTerceirizadaId)

      if (!empresa) {
        return responderErro('Empresa terceirizada não encontrada.', 404)
      }

      ordem.tipo = 'terceiros'
      ordem.empresaTerceirizadaId = empresa.id
      ordem.empresaTerceirizadaNome = empresa.nome

      return responderJson(ordem)
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/ordens-servico\/(\d+)\/encerrar$/,
    async tratar({ params, corpo }) {
      await atraso()
      const usuario = obterUsuarioSessao()
      if (!usuario) {
        return responderErro('Não autenticado.', 401)
      }

      const ordem = ordensServico.find((item) => item.id === Number(params[0]))

      if (!ordem) {
        return responderErro('Ordem de serviço não encontrada.', 404)
      }

      if (ordem.statusExecucao !== 'Em Andamento' || !ordem.dataInicio) {
        return responderErro('A OS só pode ser encerrada quando estiver Em Andamento.', 409)
      }

      const dados = corpo as Omit<EncerramentoOrdemServicoPayload, 'ordemServicoId'>
      const dataFim = agoraParaBackend()

      ordem.dataFim = dataFim
      ordem.tipoDefeito = dados.tipoDefeito
      ordem.statusExecucao = 'Concluída'
      ordem.horasTrabalhadas = calcularHorasTrabalhadas(ordem.dataInicio, dataFim, ordem.pausas ?? [])
      ordem.horasParada = ordem.afetaProducao
        ? calcularHorasParada(ordem.dataAbertura, dataFim)
        : undefined
      ordem.encerramento = {
        defeitoConstatado: dados.defeitoConstatado,
        causaRaiz: dados.causaRaiz,
        solucao: dados.solucao,
        encerradoPorNome: usuario.nome,
      }
      ordem.custo = {
        custoHoraTecnico: dados.custoHoraTecnico ?? null,
        custoManutencao: dados.custoManutencao,
        custoTotal: (dados.custoHoraTecnico ?? 0) + dados.custoManutencao,
        lancadoPorNome: usuario.nome,
        lancadoEm: dataFim,
      }
      ordem.finalizada = calcularFinalizada(ordem)

      return responderJson(ordem)
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/ordens-servico\/(\d+)\/custo$/,
    async tratar({ params, corpo }) {
      await atraso()
      const usuario = obterUsuarioSessao()
      if (!usuario) {
        return responderErro('Não autenticado.', 401)
      }

      const ordem = ordensServico.find((item) => item.id === Number(params[0]))

      if (!ordem) {
        return responderErro('Ordem de serviço não encontrada.', 404)
      }

      const dados = corpo as Omit<LancamentoCustoManutencaoPayload, 'ordemServicoId'>
      const custoHoraTecnico = dados.custoHoraTecnico ?? ordem.custo?.custoHoraTecnico ?? null

      ordem.custo = {
        custoHoraTecnico,
        custoManutencao: dados.custoManutencao,
        custoTotal: (custoHoraTecnico ?? 0) + dados.custoManutencao,
        numeroNotaFiscal: dados.numeroNotaFiscal || ordem.custo?.numeroNotaFiscal,
        serieNotaFiscal: dados.serieNotaFiscal || ordem.custo?.serieNotaFiscal,
        descricaoServicoTerceiro: dados.descricaoServicoTerceiro || ordem.custo?.descricaoServicoTerceiro,
        lancadoPorNome: usuario.nome,
        lancadoEm: agoraParaBackend(),
      }
      ordem.finalizada = calcularFinalizada(ordem)

      return responderJson(ordem)
    },
  },
]
