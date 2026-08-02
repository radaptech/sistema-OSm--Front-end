import { useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { CabecalhoTopo } from '../../componentes/CabecalhoTopo'
import { useEstadoAutenticacao } from '../../estado/estadoAutenticacao'
import { useTodasSolicitacoes } from '../../hooks/useTodasSolicitacoes'
import { usePreventivas } from '../../hooks/usePreventivas'
import { LOJAS_MOCK } from '../../servicos/dadosMockLojas'
import { servicoSolicitacoes } from '../../servicos/servicoSolicitacoes'
import { agruparPorEscopoGestor } from '../../utilitarios/acessoGestor'
import type { SolicitacaoOS } from '../../tipos/ordemServico'
import { ModalAbrirOrdemServico } from '../ModalAbrirOrdemServico/ModalAbrirOrdemServico'
import type { DadosConfirmarAberturaOS } from '../ModalAbrirOrdemServico/esquemaAbrirOrdemServico'
import { AbasPainelGestor, type AbaPainelGestor } from './componentes/AbasPainelGestor'
import { AcoesRapidas } from './componentes/AcoesRapidas'
import { BlocoLoja } from './componentes/BlocoLoja'
import { CardSolicitacaoGestor } from './componentes/CardSolicitacaoGestor'
import { CardPreventiva } from './componentes/CardPreventiva'
import { ModalDetalhesSolicitacao } from './componentes/ModalDetalhesSolicitacao'

export function PainelGestor() {
  const escoposGestor = useEstadoAutenticacao((estado) => estado.escoposGestor) ?? []
  const [abaSelecionada, setAbaSelecionada] = useState<AbaPainelGestor>('solicitacoes')
  const [solicitacaoParaAbrirOS, setSolicitacaoParaAbrirOS] = useState<SolicitacaoOS | null>(
    null,
  )
  const [solicitacaoParaVisualizar, setSolicitacaoParaVisualizar] =
    useState<SolicitacaoOS | null>(null)

  const { data: solicitacoes = [], isLoading: carregandoSolicitacoes } =
    useTodasSolicitacoes()
  const { data: preventivas = [], isLoading: carregandoPreventivas } = usePreventivas()

  const { mutateAsync: abrirOS } = useMutation({
    mutationFn: servicoSolicitacoes.abrirOS,
  })

  async function aoConfirmarAberturaOS(dados: DadosConfirmarAberturaOS) {
    if (!solicitacaoParaAbrirOS) {
      return
    }

    await abrirOS({ solicitacaoId: solicitacaoParaAbrirOS.id, ...dados })
    toast.success(`OS aberta para a solicitação #${solicitacaoParaAbrirOS.id}.`)
  }

  const solicitacoesPendentes = solicitacoes.filter(
    (solicitacao) => solicitacao.status === 'Pendente',
  )
  const solicitacoesConvertidas = solicitacoes.filter(
    (solicitacao) => solicitacao.status === 'Convertida',
  )

  const gruposSolicitacoesPendentes = agruparPorEscopoGestor(
    solicitacoesPendentes,
    escoposGestor,
    LOJAS_MOCK,
  )
  const gruposSolicitacoesConvertidas = agruparPorEscopoGestor(
    solicitacoesConvertidas,
    escoposGestor,
    LOJAS_MOCK,
  )
  const gruposPreventivas = agruparPorEscopoGestor(preventivas, escoposGestor, LOJAS_MOCK)

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoTopo />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6 sm:px-8">
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">Painel do Gestor</h1>
          <p className="mt-1 text-sm text-slate-300">
            Acompanhe as solicitações, OS e manutenções preventivas dos seus setores.
          </p>
        </div>

        <AcoesRapidas />

        <AbasPainelGestor
          abaSelecionada={abaSelecionada}
          aoSelecionarAba={setAbaSelecionada}
        />

        {escoposGestor.length === 0 && (
          <p className="rounded-xl bg-white/10 py-10 text-center text-sm text-slate-200">
            Nenhum setor/loja vinculado a este gestor.
          </p>
        )}

        {abaSelecionada === 'solicitacoes' && (
          <div className="flex flex-col gap-6">
            {carregandoSolicitacoes && (
              <p className="py-10 text-center text-sm text-slate-300">Carregando...</p>
            )}

            {!carregandoSolicitacoes &&
              gruposSolicitacoesPendentes.map((grupo) => (
                <BlocoLoja
                  key={grupo.loja.id}
                  grupo={grupo}
                  mensagemVazio="Nenhuma solicitação pendente."
                  obterChave={(solicitacao) => solicitacao.id}
                  renderItem={(solicitacao) => (
                    <CardSolicitacaoGestor
                      solicitacao={solicitacao}
                      aoAbrirOS={setSolicitacaoParaAbrirOS}
                      aoVisualizar={setSolicitacaoParaVisualizar}
                    />
                  )}
                />
              ))}
          </div>
        )}

        {abaSelecionada === 'os-finalizadas' && (
          <div className="flex flex-col gap-6">
            {carregandoSolicitacoes && (
              <p className="py-10 text-center text-sm text-slate-300">Carregando...</p>
            )}

            {!carregandoSolicitacoes &&
              gruposSolicitacoesConvertidas.map((grupo) => (
                <BlocoLoja
                  key={grupo.loja.id}
                  grupo={grupo}
                  mensagemVazio="Nenhuma OS finalizada."
                  obterChave={(solicitacao) => solicitacao.id}
                  renderItem={(solicitacao) => (
                    <CardSolicitacaoGestor
                      solicitacao={solicitacao}
                      aoVisualizar={setSolicitacaoParaVisualizar}
                    />
                  )}
                />
              ))}
          </div>
        )}

        {abaSelecionada === 'manutencao-preventiva' && (
          <div className="flex flex-col gap-6">
            {carregandoPreventivas && (
              <p className="py-10 text-center text-sm text-slate-300">Carregando...</p>
            )}

            {!carregandoPreventivas &&
              gruposPreventivas.map((grupo) => (
                <BlocoLoja
                  key={grupo.loja.id}
                  grupo={grupo}
                  mensagemVazio="Nenhuma preventiva cadastrada."
                  obterChave={(preventiva) => preventiva.id}
                  renderItem={(preventiva) => <CardPreventiva preventiva={preventiva} />}
                />
              ))}
          </div>
        )}
      </main>

      <footer className="py-4 text-center">
        <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
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

      {solicitacaoParaVisualizar && (
        <ModalDetalhesSolicitacao
          solicitacao={solicitacaoParaVisualizar}
          aoFechar={() => setSolicitacaoParaVisualizar(null)}
        />
      )}
    </div>
  )
}
