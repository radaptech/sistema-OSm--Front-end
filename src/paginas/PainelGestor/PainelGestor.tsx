import { useState } from 'react'
import { Inbox } from 'lucide-react'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CabecalhoTopo } from '../../componentes/CabecalhoTopo'
import { FiltroTipoOS } from '../../componentes/FiltroTipoOS'
import { Paginacao } from '../../componentes/Paginacao'
import { EsqueletoLista, EsqueletoCardOS } from '../../componentes/Esqueleto'
import { useEstadoAutenticacao } from '../../estado/estadoAutenticacao'
import { useTodasSolicitacoes } from '../../hooks/useTodasSolicitacoes'
import { useOrdensServicoTodas } from '../../hooks/useOrdensServicoTodas'
import { usePreventivas } from '../../hooks/usePreventivas'
import { useLojas } from '../../hooks/useLojas'
import { useSetores } from '../../hooks/useSetores'
import { servicoSolicitacoes } from '../../servicos/servicoSolicitacoes'
import { agruparPorEscopoGestor } from '../../utilitarios/acessoGestor'
import { dataEstaNoIntervalo } from '../../utilitarios/dataEstaNoIntervalo'
import { obterNomeAlvo } from '../../utilitarios/alvoOS'
import type {
  OrdemServico,
  SolicitacaoOS,
  TipoOS,
} from '../../tipos/ordemServico'
import { ModalAbrirOrdemServico } from '../ModalAbrirOrdemServico/ModalAbrirOrdemServico'
import type { DadosAbrirOrdemServico } from '../ModalAbrirOrdemServico/esquemaAbrirOrdemServico'
import { ModalDetalhesOS } from '../ModalDetalhesOS/ModalDetalhesOS'
import { ModalDetalhesSolicitacao } from '../ModalDetalhesSolicitacao/ModalDetalhesSolicitacao'
import {
  AbasPainelGestor,
  type AbaPainelGestor,
} from './componentes/AbasPainelGestor'
import { AcoesRapidas } from './componentes/AcoesRapidas'
import { BlocoLoja } from './componentes/BlocoLoja'
import { CardSolicitacaoGestor } from './componentes/CardSolicitacaoGestor'
import {
  FiltroStatusSolicitacao,
  type StatusFilaGestor,
} from './componentes/FiltroStatusSolicitacao'
import { CardOSEmExecucao } from './componentes/CardOSEmExecucao'
import { CardOSFinalizada } from './componentes/CardOSFinalizada'
import { CardPreventiva } from './componentes/CardPreventiva'
import { ModalRejeitarSolicitacao } from './componentes/ModalRejeitarSolicitacao'
import type { DadosRejeitarSolicitacao } from './esquemaRejeitarSolicitacao'
import { ModalFiltrosOS } from './componentes/ModalFiltrosOS'
import {
  FILTROS_AVANCADOS_OS_VAZIOS,
  type FiltrosAvancadosOS,
} from './filtrosOS'

const TAMANHO_PAGINA_FINALIZADAS = 12

interface SelecaoOS {
  ordem: OrdemServico
  imprimir: boolean
}

export function PainelGestor() {
  const queryClient = useQueryClient()
  const escoposGestor =
    useEstadoAutenticacao((estado) => estado.escoposGestor) ?? []
  const { data: lojas = [] } = useLojas()
  // Resolve o nome do setor no cabeçalho de cada subgrupo, inclusive quando ele está vazio.
  const { data: setores = [] } = useSetores()
  const [abaSelecionada, setAbaSelecionada] =
    useState<AbaPainelGestor>('solicitacoes')
  const [filtroTipo, setFiltroTipo] = useState<TipoOS | ''>('')
  const [filtroStatus, setFiltroStatus] = useState<StatusFilaGestor>('Pendente')
  const [filtrosAvancados, setFiltrosAvancados] = useState<FiltrosAvancadosOS>(
    FILTROS_AVANCADOS_OS_VAZIOS,
  )
  const [modalFiltrosAberto, setModalFiltrosAberto] = useState(false)
  const [paginaFinalizadas, setPaginaFinalizadas] = useState(1)
  const [solicitacaoParaAbrirOS, setSolicitacaoParaAbrirOS] =
    useState<SolicitacaoOS | null>(null)
  const [solicitacaoParaRejeitar, setSolicitacaoParaRejeitar] =
    useState<SolicitacaoOS | null>(null)
  const [solicitacaoParaVisualizar, setSolicitacaoParaVisualizar] =
    useState<SolicitacaoOS | null>(null)
  const [selecaoOS, setSelecaoOS] = useState<SelecaoOS | null>(null)

  const { data: solicitacoes = [], isLoading: carregandoSolicitacoes } =
    useTodasSolicitacoes()
  const { data: ordensServico = [], isLoading: carregandoOrdensServico } =
    useOrdensServicoTodas()
  const { data: preventivas = [], isLoading: carregandoPreventivas } =
    usePreventivas()

  async function invalidarSolicitacoesEOrdens() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-os-todas'] }),
      queryClient.invalidateQueries({ queryKey: ['ordens-servico-todas'] }),
    ])
  }

  const { mutateAsync: abrirOS } = useMutation({
    mutationFn: servicoSolicitacoes.abrirOS,
    onSuccess: invalidarSolicitacoesEOrdens,
  })

  // Rejeitar não cria OrdemServico, mas invalida as duas listas do mesmo jeito: a
  // solicitação sai da fila de pendentes do Gestor.
  const { mutateAsync: rejeitar } = useMutation({
    mutationFn: servicoSolicitacoes.rejeitar,
    onSuccess: invalidarSolicitacoesEOrdens,
  })

  async function aoConfirmarAberturaOS(dados: DadosAbrirOrdemServico) {
    if (!solicitacaoParaAbrirOS) {
      return
    }

    await abrirOS({ solicitacaoId: solicitacaoParaAbrirOS.id, ...dados })
    toast.success(`OS aberta para a solicitação #${solicitacaoParaAbrirOS.id}.`)
  }

  async function aoConfirmarRejeicao(dados: DadosRejeitarSolicitacao) {
    if (!solicitacaoParaRejeitar) {
      return
    }

    await rejeitar({ solicitacaoId: solicitacaoParaRejeitar.id, ...dados })
    toast.success(`Solicitação #${solicitacaoParaRejeitar.id} rejeitada.`)
  }

  const valorMinimoFiltro =
    filtrosAvancados.valorMinimo === ''
      ? undefined
      : Number(filtrosAvancados.valorMinimo)
  const valorMaximoFiltro =
    filtrosAvancados.valorMaximo === ''
      ? undefined
      : Number(filtrosAvancados.valorMaximo)
  const temFiltroDeValor =
    valorMinimoFiltro !== undefined || valorMaximoFiltro !== undefined

  // Aplica Loja/Máquina/Período/Valor (filtro avançado do Gestor) por cima do filtro de
  // Tipo de OS já existente. Loja é selecionada numa lista fechada (combinação exata por
  // id); Máquina funciona nos dois modos — texto livre comparado por substring, sem
  // diferenciar maiúsculas/minúsculas, e também pode ser escolhida a partir das sugestões
  // do datalist. O filtro de valor usa o custo TOTAL já lançado (Custo Hora Técnico +
  // Custo de Manutenção) — itens sem custo definido (solicitações e OS ainda em
  // andamento) só "combinam" quando nenhum filtro de valor está ativo.
  function combinaFiltrosAvancados(
    maquinaNome: string,
    lojaId: number,
    dataReferencia: string,
    valorTotal?: number,
  ): boolean {
    const combinaMaquina =
      !filtrosAvancados.maquina ||
      maquinaNome
        .toLowerCase()
        .includes(filtrosAvancados.maquina.trim().toLowerCase())
    const combinaLoja =
      !filtrosAvancados.loja || lojaId === Number(filtrosAvancados.loja)
    const combinaData = dataEstaNoIntervalo(
      dataReferencia,
      filtrosAvancados.dataInicio,
      filtrosAvancados.dataFim,
    )
    const combinaValor =
      !temFiltroDeValor ||
      (valorTotal !== undefined &&
        (valorMinimoFiltro === undefined || valorTotal >= valorMinimoFiltro) &&
        (valorMaximoFiltro === undefined || valorTotal <= valorMaximoFiltro))

    return combinaMaquina && combinaLoja && combinaData && combinaValor
  }

  // Fila do Gestor: Pendentes (esperando decisão) ou Rejeitadas (histórico do que ele
  // recusou, para consultar depois). 'Convertida' não aparece aqui — vira OS e o
  // acompanhamento passa para as abas de OS.
  const solicitacoesDaFila = solicitacoes.filter(
    (solicitacao) =>
      solicitacao.status === filtroStatus &&
      (!filtroTipo || solicitacao.tipo === filtroTipo) &&
      combinaFiltrosAvancados(
        obterNomeAlvo(solicitacao),
        solicitacao.lojaId,
        solicitacao.criadoEm,
      ),
  )

  // Contagem por status é do total no escopo, sem os filtros de tipo/avançados: o número
  // ao lado da aba precisa dizer quanto existe, não quanto sobrou do filtro atual.
  const contagensFila: Record<StatusFilaGestor, number> = {
    Pendente: solicitacoes.filter((item) => item.status === 'Pendente').length,
    Rejeitada: solicitacoes.filter((item) => item.status === 'Rejeitada')
      .length,
  }
  // Só é "OS Finalizada" para o Gestor quando ela passou por todas as etapas com
  // sucesso: Técnico encerrou (Concluída) e o Administrador já lançou o custo de
  // manutenção — ver regra de negócio no CLAUDE.md (item 11/12/13).
  const ordensFinalizadas = ordensServico.filter(
    (ordem) =>
      ordem.statusExecucao === 'Concluída' &&
      ordem.finalizada &&
      (!filtroTipo || ordem.tipo === filtroTipo) &&
      combinaFiltrosAvancados(
        obterNomeAlvo(ordem),
        ordem.lojaId,
        ordem.dataAbertura,
        (ordem.custo?.custoHoraTecnico ?? 0) +
          (ordem.custo?.custoManutencao ?? 0),
      ),
  )
  // Acompanhamento em tempo real do que o Técnico está fazendo (Aberta/Em Andamento/
  // Pausada) — o botão de pausa continua com o Técnico (ele é quem está na frente do
  // problema), mas o Gestor enxerga aqui o motivo de cada pausa para dar visibilidade
  // sem virar gargalo no fluxo. Ver regra de negócio no CLAUDE.md (item 9). Uma OS
  // encaminhada a terceiros continua aparecendo aqui: ela segue com o Técnico até ele
  // encerrar, só muda de tipo.
  const ordensEmExecucao = ordensServico.filter(
    (ordem) =>
      ordem.statusExecucao !== 'Concluída' &&
      (!filtroTipo || ordem.tipo === filtroTipo) &&
      combinaFiltrosAvancados(
        obterNomeAlvo(ordem),
        ordem.lojaId,
        ordem.dataAbertura,
      ),
  )

  const maquinasDisponiveis = [
    ...new Set(
      [...solicitacoes, ...ordensServico]
        .map((item) => item.maquinaNome)
        .filter((maquinaNome): maquinaNome is string => Boolean(maquinaNome)),
    ),
  ].sort((a, b) => a.localeCompare(b, 'pt-BR'))

  const quantidadeFiltrosAtivos =
    Object.values(filtrosAvancados).filter(Boolean).length

  const gruposSolicitacoesDaFila = agruparPorEscopoGestor(
    solicitacoesDaFila,
    escoposGestor,
    lojas,
    setores,
  )
  const gruposOSEmExecucao = agruparPorEscopoGestor(
    ordensEmExecucao,
    escoposGestor,
    lojas,
    setores,
  )
  // Paginação client-side das finalizadas: a lista cresce sem parar (é histórico), e as
  // demais abas não precisam porque esvaziam conforme o fluxo anda. Volta para a página 1
  // quando os filtros mudam -- ajuste durante a renderização, mesmo padrão das listagens
  // do Administrador.
  const chaveFiltrosFinalizadas = `${filtroTipo}|${JSON.stringify(filtrosAvancados)}`
  const [chaveFiltrosFinalizadasAnterior, setChaveFiltrosFinalizadasAnterior] =
    useState(chaveFiltrosFinalizadas)
  if (chaveFiltrosFinalizadas !== chaveFiltrosFinalizadasAnterior) {
    setChaveFiltrosFinalizadasAnterior(chaveFiltrosFinalizadas)
    setPaginaFinalizadas(1)
  }
  const totalPaginasFinalizadas = Math.max(
    1,
    Math.ceil(ordensFinalizadas.length / TAMANHO_PAGINA_FINALIZADAS),
  )
  const paginaAtualFinalizadas = Math.min(
    paginaFinalizadas,
    totalPaginasFinalizadas,
  )
  const ordensFinalizadasDaPagina = ordensFinalizadas.slice(
    (paginaAtualFinalizadas - 1) * TAMANHO_PAGINA_FINALIZADAS,
    paginaAtualFinalizadas * TAMANHO_PAGINA_FINALIZADAS,
  )
  // Agrupa só a página atual. Com alguma OS no total, esconde loja/setor sem item NESTA
  // página: senão a página 2 diria "Nenhuma OS finalizada" para uma loja que tem OS na 1.
  const gruposOSFinalizadas = agruparPorEscopoGestor(
    ordensFinalizadasDaPagina,
    escoposGestor,
    lojas,
    setores,
  ).flatMap((grupo) => {
    if (ordensFinalizadas.length === 0) {
      return [grupo]
    }
    const subgrupos = grupo.subgrupos.filter(
      (subgrupo) => subgrupo.itens.length > 0,
    )
    return subgrupos.length > 0 ? [{ ...grupo, subgrupos }] : []
  })
  const gruposPreventivas = agruparPorEscopoGestor(
    preventivas,
    escoposGestor,
    lojas,
    setores,
  )

  return (
    <div className="flex min-h-svh flex-col bg-slate-50">
      <CabecalhoTopo />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6 sm:px-8">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Painel do Gestor
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Acompanhe as solicitações, OS e manutenções preventivas dos seus
            setores.
          </p>
        </div>

        <AcoesRapidas
          aoAbrirFiltros={() => setModalFiltrosAberto(true)}
          quantidadeFiltrosAtivos={quantidadeFiltrosAtivos}
        />

        <AbasPainelGestor
          abaSelecionada={abaSelecionada}
          aoSelecionarAba={setAbaSelecionada}
        />

        {abaSelecionada !== 'manutencao-preventiva' && (
          <div className="sm:w-56">
            <FiltroTipoOS valor={filtroTipo} aoMudar={setFiltroTipo} />
          </div>
        )}

        {abaSelecionada === 'solicitacoes' && (
          <FiltroStatusSolicitacao
            valor={filtroStatus}
            aoMudar={setFiltroStatus}
            contagens={contagensFila}
          />
        )}

        {escoposGestor.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200/60 bg-white py-12 text-slate-400">
            <Inbox size={28} className="text-slate-400" />
            <p className="text-sm">
              Nenhum setor/loja vinculado a este gestor.
            </p>
          </div>
        )}

        {abaSelecionada === 'solicitacoes' && (
          <div className="flex flex-col gap-6">
            {carregandoSolicitacoes && (
              <EsqueletoLista quantidade={3}>
                <EsqueletoCardOS />
              </EsqueletoLista>
            )}

            {!carregandoSolicitacoes &&
              gruposSolicitacoesDaFila.map((grupo) => (
                <BlocoLoja
                  key={grupo.loja.id}
                  grupo={grupo}
                  mensagemVazio={
                    filtroStatus === 'Pendente'
                      ? 'Nenhuma solicitação pendente.'
                      : 'Nenhuma solicitação rejeitada.'
                  }
                  obterChave={(solicitacao) => solicitacao.id}
                  renderItem={(solicitacao) => (
                    <CardSolicitacaoGestor
                      solicitacao={solicitacao}
                      // Rejeitada é histórico: sobra só o botão de visualizar.
                      aoAbrirOS={
                        filtroStatus === 'Pendente'
                          ? setSolicitacaoParaAbrirOS
                          : undefined
                      }
                      aoRejeitar={
                        filtroStatus === 'Pendente'
                          ? setSolicitacaoParaRejeitar
                          : undefined
                      }
                      aoVisualizar={setSolicitacaoParaVisualizar}
                    />
                  )}
                />
              ))}
          </div>
        )}

        {abaSelecionada === 'os-em-andamento' && (
          <div className="flex flex-col gap-6">
            {carregandoOrdensServico && (
              <EsqueletoLista quantidade={3}>
                <EsqueletoCardOS />
              </EsqueletoLista>
            )}

            {!carregandoOrdensServico &&
              gruposOSEmExecucao.map((grupo) => (
                <BlocoLoja
                  key={grupo.loja.id}
                  grupo={grupo}
                  mensagemVazio="Nenhuma OS em aberto, em andamento ou pausada no momento."
                  obterChave={(ordemServico) => ordemServico.id}
                  renderItem={(ordemServico) => (
                    <CardOSEmExecucao ordemServico={ordemServico} />
                  )}
                />
              ))}
          </div>
        )}

        {abaSelecionada === 'os-finalizadas' && (
          <div className="flex flex-col gap-6">
            {carregandoOrdensServico && (
              <EsqueletoLista quantidade={3}>
                <EsqueletoCardOS />
              </EsqueletoLista>
            )}

            {!carregandoOrdensServico &&
              gruposOSFinalizadas.map((grupo) => (
                <BlocoLoja
                  key={grupo.loja.id}
                  grupo={grupo}
                  mensagemVazio="Nenhuma OS finalizada ainda — a OS só aparece aqui depois que o Técnico encerra o atendimento e o Administrador lança o custo de manutenção."
                  obterChave={(ordemServico) => ordemServico.id}
                  renderItem={(ordemServico) => (
                    <CardOSFinalizada
                      ordemServico={ordemServico}
                      aoVisualizar={(ordem) =>
                        setSelecaoOS({ ordem, imprimir: false })
                      }
                      aoImprimir={(ordem) =>
                        setSelecaoOS({ ordem, imprimir: true })
                      }
                    />
                  )}
                />
              ))}

            {!carregandoOrdensServico && totalPaginasFinalizadas > 1 && (
              <Paginacao
                pagina={paginaAtualFinalizadas}
                totalPaginas={totalPaginasFinalizadas}
                aoMudarPagina={setPaginaFinalizadas}
              />
            )}
          </div>
        )}

        {abaSelecionada === 'manutencao-preventiva' && (
          <div className="flex flex-col gap-6">
            {carregandoPreventivas && (
              <EsqueletoLista quantidade={3}>
                <EsqueletoCardOS />
              </EsqueletoLista>
            )}

            {!carregandoPreventivas &&
              gruposPreventivas.map((grupo) => (
                <BlocoLoja
                  key={grupo.loja.id}
                  grupo={grupo}
                  mensagemVazio="Nenhuma preventiva cadastrada."
                  obterChave={(preventiva) => preventiva.id}
                  renderItem={(preventiva) => (
                    <CardPreventiva preventiva={preventiva} />
                  )}
                />
              ))}
          </div>
        )}
      </main>

      <footer className="py-4 text-center">
        <span className="font-mono text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Solicitação OS © {new Date().getFullYear()}
        </span>
      </footer>

      {solicitacaoParaAbrirOS && (
        <ModalAbrirOrdemServico
          solicitacao={solicitacaoParaAbrirOS}
          aoFechar={() => setSolicitacaoParaAbrirOS(null)}
          aoSalvar={aoConfirmarAberturaOS}
        />
      )}

      {solicitacaoParaRejeitar && (
        <ModalRejeitarSolicitacao
          solicitacao={solicitacaoParaRejeitar}
          aoFechar={() => setSolicitacaoParaRejeitar(null)}
          aoSalvar={aoConfirmarRejeicao}
        />
      )}

      {solicitacaoParaVisualizar && (
        <ModalDetalhesSolicitacao
          solicitacao={solicitacaoParaVisualizar}
          contexto="Painel do Gestor"
          aoFechar={() => setSolicitacaoParaVisualizar(null)}
        />
      )}

      {selecaoOS && (
        <ModalDetalhesOS
          ordemServico={selecaoOS.ordem}
          autoImprimir={selecaoOS.imprimir}
          contexto="Painel do Gestor"
          aoFechar={() => setSelecaoOS(null)}
        />
      )}

      {modalFiltrosAberto && (
        <ModalFiltrosOS
          lojas={lojas}
          maquinas={maquinasDisponiveis}
          filtros={filtrosAvancados}
          aoFechar={() => setModalFiltrosAberto(false)}
          aoAplicar={(novosFiltros) => {
            setFiltrosAvancados(novosFiltros)
            setModalFiltrosAberto(false)
          }}
        />
      )}
    </div>
  )
}
