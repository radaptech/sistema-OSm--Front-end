import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Ban, XCircle } from 'lucide-react'
import { Botao } from '../../../componentes/Botao'
import { CampoTextoArea } from '../../../componentes/CampoTextoArea'
import { obterNomeAlvo } from '../../../utilitarios/alvoOS'
import type { SolicitacaoOS } from '../../../tipos/ordemServico'
import {
  esquemaRejeitarSolicitacao,
  type DadosRejeitarSolicitacao,
} from '../esquemaRejeitarSolicitacao'

interface ModalRejeitarSolicitacaoProps {
  solicitacao: SolicitacaoOS
  aoFechar: () => void
  aoSalvar: (dados: DadosRejeitarSolicitacao) => void
}

export function ModalRejeitarSolicitacao({
  solicitacao,
  aoFechar,
  aoSalvar,
}: ModalRejeitarSolicitacaoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosRejeitarSolicitacao>({
    resolver: zodResolver(esquemaRejeitarSolicitacao),
    defaultValues: { motivo: '' },
  })

  function aoSalvarFormulario(dados: DadosRejeitarSolicitacao) {
    aoSalvar(dados)
    aoFechar()
  }

  return createPortal(
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-pop-in shadow-pop w-full max-w-md overflow-hidden rounded-2xl bg-white">
        <div className="flex items-start justify-between bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div>
            <p className="font-mono text-xs font-bold tracking-widest text-white/80 uppercase">
              Painel do Gestor
            </p>
            <p className="font-display text-lg font-bold text-white">
              Rejeitar Solicitação · #{solicitacao.id}
            </p>
            <p className="text-xs text-white/80">
              {obterNomeAlvo(solicitacao)}
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

        <form
          onSubmit={(evento) => {
            evento.stopPropagation()
            handleSubmit(aoSalvarFormulario)(evento)
          }}
          noValidate
          className="flex flex-col gap-5 p-6"
        >
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            A solicitação será encerrada sem abrir OS, e o motivo aparecerá para
            o Solicitante em Minhas Solicitações. Não há como desfazer — se o
            pedido for válido, ele precisará ser aberto de novo.
          </p>

          <CampoTextoArea
            rotulo="Motivo da Rejeição *"
            rows={4}
            maxLength={300}
            placeholder="Ex: Máquina já atendida na OS #182 — abra uma nova solicitação se o defeito voltar."
            mensagemErro={errors.motivo?.message}
            {...register('motivo')}
          />

          <div className="mt-1 flex gap-3">
            <div className="flex-1">
              <Botao type="button" variante="secundario" onClick={aoFechar}>
                Cancelar
              </Botao>
            </div>
            <div className="flex-1">
              <Botao
                type="submit"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600"
              >
                <Ban size={16} />
                Rejeitar
              </Botao>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
