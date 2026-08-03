import { useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CabecalhoTopo } from '../../componentes/CabecalhoTopo'
import { useEstadoAutenticacao } from '../../estado/estadoAutenticacao'
import { useOrdensServicoTecnico } from '../../hooks/useOrdensServicoTecnico'
import { LOJAS_MOCK } from '../../servicos/dadosMockLojas'
import { servicoOrdensServico } from '../../servicos/servicoOrdensServico'
import type { OrdemServico } from '../../tipos/ordemServico'
import { agruparPorSetorLoja } from '../../utilitarios/agruparPorSetorLoja'
import { ModalEncerrarOrdemServico } from '../ModalEncerrarOrdemServico/ModalEncerrarOrdemServico'
import type { DadosEncerrarOrdemServico } from '../ModalEncerrarOrdemServico/esquemaEncerrarOrdemServico'
import { AbasPainelTecnico, type AbaPainelTecnico } from './componentes/AbasPainelTecnico'
import { BlocoSetorLoja } from './componentes/BlocoSetorLoja'
import { CardOrdemServicoTecnico } from './componentes/CardOrdemServicoTecnico'
import { ModalDetalhesEncerramento } from './componentes/ModalDetalhesEncerramento'
import { ModalPausarOrdemServico } from './componentes/ModalPausarOrdemServico'
import type { DadosPausarOrdemServico } from './esquemaPausarOrdemServico'

const CHAVE_ORDENS_SERVICO_TECNICO = 'ordens-servico-tecnico'

export function PainelTecnico() {
  const tecnicoId = useEstadoAutenticacao((estado) => estado.tecnicoId)
  const queryClient = useQueryClient()
  const [abaSelecionada, setAbaSelecionada] = useState<AbaPainelTecnico>('em-aberto')
  const [ordemParaPausar, setOrdemParaPausar] = useState<OrdemServico | null>(null)
  const [ordemParaEncerrar, setOrdemParaEncerrar] = useState<OrdemServico | null>(null)
  const [ordemParaVerDetalhes, setOrdemParaVerDetalhes] = useState<OrdemServico | null>(null)

  const { data: ordensServico = [], isLoading } = useOrdensServicoTecnico(tecnicoId)

  function invalidarOrdensServico() {
    return queryClient.invalidateQueries({ queryKey: [CHAVE_ORDENS_SERVICO_TECNICO] })
  }

  const { mutateAsync: iniciar } = useMutation({
    mutationFn: (id: number) => servicoOrdensServico.iniciar(id),
    onSuccess: invalidarOrdensServico,
  })

  const { mutateAsync: pausar } = useMutation({
    mutationFn: ({ id, motivoPausa }: { id: number; motivoPausa: string }) =>
      servicoOrdensServico.pausar(id, motivoPausa),
    onSuccess: invalidarOrdensServico,
  })

  const { mutateAsync: retomar } = useMutation({
    mutationFn: (id: number) => servicoOrdensServico.retomar(id),
    onSuccess: invalidarOrdensServico,
  })

  const { mutateAsync: encerrar } = useMutation({
    mutationFn: servicoOrdensServico.encerrar,
    onSuccess: invalidarOrdensServico,
  })

  async function aoIniciar(ordemServico: OrdemServico) {
    await iniciar(ordemServico.id)
    toast.success(`OS #${ordemServico.id} iniciada.`)
  }

  async function aoConfirmarPausa(dados: DadosPausarOrdemServico) {
    if (!ordemParaPausar) {
      return
    }

    await pausar({ id: ordemParaPausar.id, motivoPausa: dados.motivoPausa })
    toast.success(`OS #${ordemParaPausar.id} pausada.`)
  }

  async function aoRetomar(ordemServico: OrdemServico) {
    await retomar(ordemServico.id)
    toast.success(`OS #${ordemServico.id} retomada.`)
  }

  async function aoConfirmarEncerramento(
    dados: DadosEncerrarOrdemServico & { dataInicio: string; dataFim: string },
  ) {
    if (!ordemParaEncerrar) {
      return
    }

    await encerrar({ ordemServicoId: ordemParaEncerrar.id, ...dados })
    toast.success(`OS #${ordemParaEncerrar.id} encerrada com sucesso.`)
  }

  const ordensPorAba: Record<AbaPainelTecnico, OrdemServico[]> = {
    'em-aberto': ordensServico.filter(
      (ordem) => ordem.statusExecucao === 'Aberta' || ordem.statusExecucao === 'Em Andamento',
    ),
    'pendentes-pausadas': ordensServico.filter(
      (ordem) => ordem.statusExecucao === 'Pausada',
    ),
    concluidas: ordensServico.filter((ordem) => ordem.statusExecucao === 'Concluída'),
  }

  const MENSAGENS_VAZIO: Record<AbaPainelTecnico, string> = {
    'em-aberto': 'Nenhuma OS em aberto no momento.',
    'pendentes-pausadas': 'Nenhuma OS pendente ou pausada.',
    concluidas: 'Nenhuma OS concluída ainda.',
  }

  const ordensExibidas = ordensPorAba[abaSelecionada]
  const gruposExibidos = agruparPorSetorLoja(ordensExibidas, LOJAS_MOCK)

  function renderizarCard(ordemServico: OrdemServico) {
    return (
      <CardOrdemServicoTecnico
        ordemServico={ordemServico}
        aoIniciar={ordemServico.statusExecucao === 'Aberta' ? aoIniciar : undefined}
        aoPausar={
          ordemServico.statusExecucao === 'Aberta' ||
          ordemServico.statusExecucao === 'Em Andamento'
            ? setOrdemParaPausar
            : undefined
        }
        aoRetomar={ordemServico.statusExecucao === 'Pausada' ? aoRetomar : undefined}
        aoFinalizar={
          ordemServico.statusExecucao === 'Em Andamento' ? setOrdemParaEncerrar : undefined
        }
        aoVerDetalhes={
          ordemServico.statusExecucao === 'Concluída' ? setOrdemParaVerDetalhes : undefined
        }
      />
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoTopo />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6 sm:px-8">
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">Painel do Técnico</h1>
          <p className="mt-1 text-sm text-slate-300">
            Acompanhe as ordens de serviço em que você é o técnico responsável.
          </p>
        </div>

        <AbasPainelTecnico
          abaSelecionada={abaSelecionada}
          aoSelecionarAba={setAbaSelecionada}
        />

        <div className="flex flex-col gap-6">
          {isLoading && (
            <p className="py-10 text-center text-sm text-slate-300">Carregando...</p>
          )}

          {!isLoading && ordensExibidas.length === 0 && (
            <p className="rounded-xl bg-white/10 py-10 text-center text-sm text-slate-200">
              {MENSAGENS_VAZIO[abaSelecionada]}
            </p>
          )}

          {!isLoading &&
            gruposExibidos.map((grupo) => (
              <BlocoSetorLoja
                key={grupo.chave}
                grupo={grupo}
                obterChave={(ordemServico) => ordemServico.id}
                renderItem={renderizarCard}
              />
            ))}
        </div>
      </main>

      <footer className="py-4 text-center">
        <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Solicitação OS © {new Date().getFullYear()}
        </span>
      </footer>

      {ordemParaPausar && (
        <ModalPausarOrdemServico
          ordemServico={ordemParaPausar}
          aoFechar={() => setOrdemParaPausar(null)}
          aoSalvar={aoConfirmarPausa}
        />
      )}

      {ordemParaEncerrar && (
        <ModalEncerrarOrdemServico
          ordemServico={ordemParaEncerrar}
          aoFechar={() => setOrdemParaEncerrar(null)}
          aoSalvar={aoConfirmarEncerramento}
        />
      )}

      {ordemParaVerDetalhes && (
        <ModalDetalhesEncerramento
          ordemServico={ordemParaVerDetalhes}
          aoFechar={() => setOrdemParaVerDetalhes(null)}
        />
      )}
    </div>
  )
}
