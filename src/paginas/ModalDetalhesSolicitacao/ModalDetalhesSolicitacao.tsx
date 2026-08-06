import { createPortal } from 'react-dom'
import { XCircle } from 'lucide-react'
import { Botao } from '../../componentes/Botao'
import { BadgeOrigemPreventiva } from '../../componentes/BadgeOrigemPreventiva'
import { BadgeStatus } from '../../componentes/BadgeStatus'
import { BadgeTipoOS } from '../../componentes/BadgeTipoOS'
import { LOJAS_MOCK } from '../../servicos/dadosMockLojas'
import { MAQUINAS_MOCK } from '../../servicos/dadosMockMaquinas'
import { formatarDataHora } from '../../utilitarios/formatarData'
import type { SolicitacaoOS } from '../../tipos/ordemServico'

interface ModalDetalhesSolicitacaoProps {
  solicitacao: SolicitacaoOS
  contexto: string
  aoFechar: () => void
}

export function ModalDetalhesSolicitacao({
  solicitacao,
  contexto,
  aoFechar,
}: ModalDetalhesSolicitacaoProps) {
  const loja = LOJAS_MOCK.find((item) => item.id === solicitacao.lojaId)
  const maquinaCadastrada = MAQUINAS_MOCK.find(
    (item) => item.id === solicitacao.maquinaCodigo,
  )
  const ehPreventiva = solicitacao.origem === 'preventiva'

  return createPortal(
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-pop-in w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-pop">
        <div className="flex items-start justify-between bg-gradient-to-r from-marca-900 to-marca-500 px-6 py-4">
          <div>
            <p className="font-mono text-xs font-bold tracking-widest text-white/80 uppercase">
              {contexto}
            </p>
            <p className="font-display text-lg font-bold text-white">
              Solicitação #{solicitacao.id}
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={aoFechar}
            className="text-white/90 transition hover:text-white"
          >
            <XCircle size={22} />
          </button>
        </div>

        <div className="flex max-h-[75vh] flex-col gap-4 overflow-y-auto p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-800">
                {solicitacao.maquinaNome}
              </p>
              <p className="font-mono text-sm text-slate-400">
                {solicitacao.maquinaCodigo}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex gap-1.5">
                <BadgeStatus status={solicitacao.status} />
                <BadgeTipoOS tipo={solicitacao.tipo} />
              </div>
              {ehPreventiva && <BadgeOrigemPreventiva />}
            </div>
          </div>

          {maquinaCadastrada?.fotoUrl && (
            <div>
              <p className="mb-1 font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Foto da Máquina (cadastro)
              </p>
              <img
                src={maquinaCadastrada.fotoUrl}
                alt={solicitacao.maquinaNome}
                className="h-40 w-full rounded-lg object-contain bg-slate-50"
              />
            </div>
          )}

          {solicitacao.fotoUrl && (
            <div>
              <p className="mb-1 font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
                {solicitacao.tipo === 'reparo' ? 'Foto do Item' : 'Foto do Defeito'}
              </p>
              <img
                src={solicitacao.fotoUrl}
                alt={solicitacao.tipo === 'reparo' ? 'Foto do item' : 'Foto do defeito'}
                className="h-40 w-full rounded-lg object-contain bg-slate-50"
              />
            </div>
          )}

          {solicitacao.videoUrl && (
            <div>
              <p className="mb-1 font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Vídeo do Defeito
              </p>
              <video
                src={solicitacao.videoUrl}
                controls
                className="h-40 w-full rounded-lg bg-black object-contain"
              />
            </div>
          )}

          {ehPreventiva && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Solicitação aberta automaticamente pelo sistema ao vencer a
              manutenção preventiva desta máquina.
            </p>
          )}

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <span className="font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Loja
            </span>
            <span className="font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Setor
            </span>
            <p className="text-slate-700">{loja?.nome ?? '—'}</p>
            <p className="text-slate-700">{solicitacao.setor}</p>

            <span className="mt-2 font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Solicitante
            </span>
            <span className="mt-2 font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Data/Hora
            </span>
            <p className="text-slate-700">{solicitacao.solicitante}</p>
            <p className="font-mono text-slate-700">
              {formatarDataHora(solicitacao.criadoEm)}
            </p>

            {solicitacao.tipoDefeito && (
              <>
                <span className="mt-2 font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Tipo de Defeito
                </span>
                <span className="mt-2" />
                <p className="text-slate-700">{solicitacao.tipoDefeito}</p>
                <p />
              </>
            )}
          </div>

          <div>
            <p className="font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Descrição
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {solicitacao.descricao}
            </p>
          </div>

          <div>
            <p className="font-mono text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Marcadores de Impacto
            </p>
            {solicitacao.impactos.length === 0 ? (
              <p className="mt-1 text-sm text-slate-400">
                Nenhum marcador informado.
              </p>
            ) : (
              <div className="mt-1 flex flex-wrap gap-2">
                {solicitacao.impactos.map((marcador) => (
                  <span
                    key={marcador}
                    className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700"
                  >
                    {marcador}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Botao type="button" variante="secundario" onClick={aoFechar}>
            Fechar
          </Botao>
        </div>
      </div>
    </div>,
    document.body,
  )
}
