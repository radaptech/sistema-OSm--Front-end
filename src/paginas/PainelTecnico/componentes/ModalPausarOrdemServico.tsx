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
    defaultValues: { motivo: '' },
  })

  function aoSalvarFormulario(dados: DadosPausarOrdemServico) {
    aoSalvar(dados)
    aoFechar()
  }

  return createPortal(
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-pop-in w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-pop">
        <div className="flex items-start justify-between bg-gradient-to-r from-marca-900 to-marca-500 px-6 py-4">
          <div>
            <p className="font-mono text-xs font-bold tracking-widest text-white/80 uppercase">
              Painel do Técnico
            </p>
            <p className="font-display text-lg font-bold text-white">
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
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Pausar interrompe apenas o relógio de horas trabalhadas do técnico — o tempo de
            máquina parada continua contando normalmente até o encerramento da OS.
          </p>

          <CampoTextoArea
            rotulo="Motivo da Pausa *"
            rows={4}
            maxLength={300}
            placeholder="Ex: Aguardando peça de reposição do fornecedor."
            mensagemErro={errors.motivo?.message}
            {...register('motivo')}
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
