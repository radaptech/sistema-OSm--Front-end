import { agoraParaBackend, converterDataBackend } from '../../utilitarios/dataBackend'
import type {
  AnexoSolicitacao,
  IdUrgencia,
  NovaSolicitacaoOSPayload,
  OrdemServico,
  ResumoSolicitacoes,
  SolicitacaoOS,
} from '../../tipos/ordemServico'
import type { NovaSolicitacaoReparoPayload } from '../../tipos/reparo'
import { lojas, maquinas, obterUsuarioSessao, ordensServico, setores, solicitacoes, usuarios } from '../bancoMock'
import { construirEscoposGestor, gestorTemAcesso, sincronizarPreventivasVencidas } from '../regrasMock'
import {
  atraso,
  extrairCorpo,
  gerarId,
  paginarLista,
  responderErro,
  responderJson,
  urlArquivoEnviado,
  type Rota,
} from '../utilidadesMock'

function gerarIdAnexo(): number {
  return gerarId(solicitacoes.flatMap((solicitacao) => solicitacao.anexos))
}

function ordenarPorCriadoEmDesc(lista: SolicitacaoOS[]): SolicitacaoOS[] {
  return [...lista].sort(
    (a, b) => converterDataBackend(b.criadoEm).getTime() - converterDataBackend(a.criadoEm).getTime(),
  )
}

function combinaBusca(solicitacao: SolicitacaoOS, termo: string): boolean {
  const alvo = solicitacao.maquinaNome ?? solicitacao.itemDescricao ?? ''
  return (
    solicitacao.descricao.toLowerCase().includes(termo) || alvo.toLowerCase().includes(termo)
  )
}

export const rotasSolicitacoes: Rota[] = [
  {
    metodo: 'POST',
    padrao: /^\/solicitacoes\/maquinario$/,
    async tratar({ corpo }) {
      await atraso()
      const usuario = obterUsuarioSessao()
      if (!usuario) {
        return responderErro('Não autenticado.', 401)
      }

      const { dados, arquivos } = extrairCorpo(corpo)
      const payload = dados as unknown as NovaSolicitacaoOSPayload
      const maquina = maquinas.find((item) => item.id === payload.maquinaId)

      if (!maquina) {
        return responderErro('Máquina não encontrada.', 404)
      }

      const idBase = gerarIdAnexo()
      const anexos: AnexoSolicitacao[] = []
      const fotoUrl = urlArquivoEnviado(arquivos, 'foto')
      if (fotoUrl) {
        anexos.push({ id: idBase, tipo: 'foto', url: fotoUrl })
      }
      const videoUrl = urlArquivoEnviado(arquivos, 'video')
      if (videoUrl) {
        anexos.push({ id: idBase + 1, tipo: 'video', url: videoUrl })
      }

      const nova: SolicitacaoOS = {
        id: gerarId(solicitacoes),
        tipo: 'maquinario',
        maquinaId: maquina.id,
        maquinaNome: maquina.nome,
        maquinaCodigo: maquina.numeroPatrimonio ?? null,
        maquinaFotoUrl: maquina.fotoUrl,
        itemDescricao: null,
        status: 'Pendente',
        descricao: payload.descricao,
        solicitanteId: usuario.id,
        solicitanteNome: usuario.nome,
        criadoEm: agoraParaBackend(),
        setorId: maquina.setorId,
        setorNome: maquina.setorNome,
        lojaId: maquina.lojaId,
        lojaNome: maquina.lojaNome ?? '',
        impactos: payload.impactos ?? [],
        origem: 'solicitante',
        anexos,
      }

      solicitacoes.push(nova)
      return responderJson(nova, 201)
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/solicitacoes\/reparo$/,
    async tratar({ corpo }) {
      await atraso()
      const usuario = obterUsuarioSessao()
      if (!usuario) {
        return responderErro('Não autenticado.', 401)
      }

      const { dados, arquivos } = extrairCorpo(corpo)
      const payload = dados as unknown as NovaSolicitacaoReparoPayload
      const setor = setores.find((item) => item.id === usuario.setoresIds[0])
      const loja = lojas.find((item) => item.id === usuario.lojasIds[0])
      const fotoUrl = urlArquivoEnviado(arquivos, 'foto')
      const anexos: AnexoSolicitacao[] = fotoUrl
        ? [{ id: gerarIdAnexo(), tipo: 'foto', url: fotoUrl }]
        : []

      const nova: SolicitacaoOS = {
        id: gerarId(solicitacoes),
        tipo: 'reparo',
        maquinaId: null,
        maquinaNome: null,
        maquinaCodigo: null,
        itemDescricao: payload.item,
        status: 'Pendente',
        descricao: payload.descricao,
        solicitanteId: usuario.id,
        solicitanteNome: usuario.nome,
        criadoEm: agoraParaBackend(),
        setorId: setor?.id ?? 0,
        setorNome: setor?.nome ?? '',
        lojaId: loja?.id ?? 0,
        lojaNome: loja?.nome ?? '',
        impactos: [],
        origem: 'solicitante',
        anexos,
      }

      solicitacoes.push(nova)
      return responderJson(nova, 201)
    },
  },
  {
    metodo: 'GET',
    padrao: /^\/solicitacoes\/minhas$/,
    async tratar({ query }) {
      await atraso()
      const usuario = obterUsuarioSessao()
      if (!usuario) {
        return responderErro('Não autenticado.', 401)
      }

      sincronizarPreventivasVencidas()

      let lista = solicitacoes.filter((item) => item.solicitanteId === usuario.id)

      const status = query.get('status')
      if (status) {
        lista = lista.filter((item) => item.status === status)
      }

      const busca = query.get('busca')
      if (busca) {
        const termo = busca.toLowerCase()
        lista = lista.filter((item) => combinaBusca(item, termo))
      }

      const pagina = Number(query.get('pagina') ?? '1')
      return responderJson(paginarLista(ordenarPorCriadoEmDesc(lista), pagina, 10))
    },
  },
  {
    metodo: 'GET',
    padrao: /^\/solicitacoes\/resumo$/,
    async tratar() {
      await atraso()
      const usuario = obterUsuarioSessao()
      if (!usuario) {
        return responderErro('Não autenticado.', 401)
      }

      const minhas = solicitacoes.filter((item) => item.solicitanteId === usuario.id)
      const resumo: ResumoSolicitacoes = { abertas: 0, emAndamento: 0, concluidas: 0 }

      for (const solicitacao of minhas) {
        if (solicitacao.status === 'Pendente') {
          resumo.abertas += 1
          continue
        }

        if (solicitacao.status !== 'Convertida') {
          continue
        }

        const ordem = ordensServico.find((item) => item.solicitacaoId === solicitacao.id)
        if (!ordem) {
          continue
        }

        if (ordem.statusExecucao === 'Aberta') {
          resumo.abertas += 1
        } else if (ordem.statusExecucao === 'Concluída') {
          resumo.concluidas += 1
        } else {
          resumo.emAndamento += 1
        }
      }

      return responderJson(resumo)
    },
  },
  {
    metodo: 'GET',
    padrao: /^\/solicitacoes$/,
    async tratar({ query }) {
      await atraso()
      const usuario = obterUsuarioSessao()
      if (!usuario) {
        return responderErro('Não autenticado.', 401)
      }

      sincronizarPreventivasVencidas()

      let lista = [...solicitacoes]

      if (usuario.perfil === 'gestor') {
        const escopos = construirEscoposGestor(usuario)
        lista = lista.filter((item) => gestorTemAcesso(escopos, item.lojaId, item.setorId))
      }

      const status = query.get('status')
      if (status) {
        lista = lista.filter((item) => item.status === status)
      }

      const tipo = query.get('tipo')
      if (tipo) {
        lista = lista.filter((item) => item.tipo === tipo)
      }

      const lojaId = query.get('lojaId')
      if (lojaId) {
        lista = lista.filter((item) => item.lojaId === Number(lojaId))
      }

      const busca = query.get('busca')
      if (busca) {
        const termo = busca.toLowerCase()
        lista = lista.filter((item) => combinaBusca(item, termo))
      }

      return responderJson(ordenarPorCriadoEmDesc(lista))
    },
  },
  {
    metodo: 'GET',
    padrao: /^\/solicitacoes\/(\d+)$/,
    async tratar({ params }) {
      await atraso()
      const solicitacao = solicitacoes.find((item) => item.id === Number(params[0]))
      return solicitacao ? responderJson(solicitacao) : responderErro('Solicitação não encontrada.', 404)
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/solicitacoes\/(\d+)\/abrir-os$/,
    async tratar({ params, corpo }) {
      await atraso()
      const solicitacao = solicitacoes.find((item) => item.id === Number(params[0]))

      if (!solicitacao) {
        return responderErro('Solicitação não encontrada.', 404)
      }

      if (solicitacao.status !== 'Pendente') {
        return responderErro('Solicitação já foi processada.', 409)
      }

      const dados = corpo as { urgencia: IdUrgencia; tecnicoId: number }
      const tecnico = usuarios.find((item) => item.id === dados.tecnicoId && item.perfil === 'tecnico')

      if (!tecnico) {
        return responderErro('Técnico não encontrado.', 404)
      }

      const novaOrdem: OrdemServico = {
        id: gerarId(ordensServico),
        solicitacaoId: solicitacao.id,
        tipo: solicitacao.tipo,
        maquinaId: solicitacao.maquinaId,
        maquinaNome: solicitacao.maquinaNome,
        maquinaCodigo: solicitacao.maquinaCodigo,
        itemDescricao: solicitacao.itemDescricao,
        descricao: solicitacao.descricao,
        setorId: solicitacao.setorId,
        setorNome: solicitacao.setorNome,
        lojaId: solicitacao.lojaId,
        lojaNome: solicitacao.lojaNome,
        solicitanteNome: solicitacao.solicitanteNome,
        urgencia: dados.urgencia,
        tecnicoId: tecnico.id,
        tecnicoNome: tecnico.nome,
        tecnicoArea: tecnico.area,
        statusExecucao: 'Aberta',
        finalizada: false,
        afetaProducao: solicitacao.impactos.includes('Afeta Produção'),
        dataAbertura: agoraParaBackend(),
        pausas: [],
      }

      ordensServico.push(novaOrdem)
      solicitacao.status = 'Convertida'

      return responderJson(novaOrdem, 201)
    },
  },
  {
    metodo: 'POST',
    padrao: /^\/solicitacoes\/(\d+)\/rejeitar$/,
    async tratar({ params, corpo }) {
      await atraso()
      const usuario = obterUsuarioSessao()
      if (!usuario) {
        return responderErro('Não autenticado.', 401)
      }

      const solicitacao = solicitacoes.find((item) => item.id === Number(params[0]))

      if (!solicitacao) {
        return responderErro('Solicitação não encontrada.', 404)
      }

      if (solicitacao.status !== 'Pendente') {
        return responderErro('Solicitação já foi processada.', 409)
      }

      const dados = corpo as { motivo: string }
      solicitacao.status = 'Rejeitada'
      solicitacao.motivoRejeicao = dados.motivo
      solicitacao.rejeitadoPorNome = usuario.nome

      return responderJson(solicitacao)
    },
  },
]
