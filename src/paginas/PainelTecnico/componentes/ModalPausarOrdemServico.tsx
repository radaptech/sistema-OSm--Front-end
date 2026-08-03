import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PauseCircle, XCircle } from 'lucide-react'
import { Botao } from '../../../componentes/Botao'
import { CampoTextoArea } from '../../../componentes/CampoTextoArea'
import type { OrdemServico } from '../../../tipos/ordemServico'
import {
  esquemaPausarOrdemServico,
  type DadosPausarOrdemServico,
} from '../esquemaPausarOrdemServico'

interface ModalPausarOrdemServicoProps {
  ordemServico: OrdemServico
  aoFechar: () => void
  aoSalvar: (dados: DadosPausarOrdemServico) => void
}

export function ModalPausarOrdemServico({
  ordemServico,
  aoFechar,
  aoSalvar,
}: ModalPausarOrdemServicoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosPausarOrdemServico>({
    resolver: zodResolver(esquemaPausarOrdemServico),
    defaultValues: { motivoPausa: '' },
  })

  function aoSalvarFormulario(dados: DadosPausarOrdemServico) {
    aoSalvar(dados)
    aoFechar()
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-6 py-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-white/80 uppercase">
              Painel do Técnico
            </p>
            <p className="text-lg font-bold text-white">
              Pausar OS · #{ordemServico.id}
            </p>
            <p className="text-xs text-white/80">{ordemServico.maquinaNome}</p>
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
          <CampoTextoArea
            rotulo="Motivo da Pausa *"
            rows={4}
            maxLength={300}
            placeholder="Ex: Aguardando peça de reposição do fornecedor."
            mensagemErro={errors.motivoPausa?.message}
            {...register('motivoPausa')}
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <Botao type="button" variante="secundario" onClick={aoFechar}>
                Cancelar
              </Botao>
            </div>
            <div className="flex-1">
              <Botao type="submit" className="flex items-center justify-center gap-2">
                <PauseCircle size={16} />
                Pausar OS
              </Botao>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
