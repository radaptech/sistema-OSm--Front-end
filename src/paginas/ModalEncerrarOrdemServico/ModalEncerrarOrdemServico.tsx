import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Botao } from '../../componentes/Botao'
import { CampoTexto } from '../../componentes/CampoTexto'
import { CampoTextoArea } from '../../componentes/CampoTextoArea'
import { formatarDataHora } from '../../utilitarios/formatarData'
import type { OrdemServico } from '../../tipos/ordemServico'
import {
  esquemaEncerrarOrdemServico,
  type DadosEncerrarOrdemServico,
} from './esquemaEncerrarOrdemServico'

interface ModalEncerrarOrdemServicoProps {
  ordemServico: OrdemServico
  aoFechar: () => void
  aoSalvar: (dados: DadosEncerrarOrdemServico & { dataInicio: string; dataFim: string }) => void
}

export function ModalEncerrarOrdemServico({
  ordemServico,
  aoFechar,
  aoSalvar,
}: ModalEncerrarOrdemServicoProps) {
  const dataInicio = ordemServico.dataInicio ?? ordemServico.dataAbertura
  const agora = new Date()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosEncerrarOrdemServico>({
    resolver: zodResolver(esquemaEncerrarOrdemServico),
    defaultValues: {
      horaEstimada: undefined,
      custo: undefined,
      defeitoConstatado: '',
      causaRaiz: '',
      solucao: '',
    },
  })

  function aoSalvarFormulario(dados: DadosEncerrarOrdemServico) {
    aoSalvar({ ...dados, dataInicio, dataFim: agora.toISOString() })
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
              Encerrar OS · #{ordemServico.id}
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
          className="flex max-h-[75vh] flex-col gap-5 overflow-y-auto p-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold tracking-wide text-[#4bae70] uppercase">
                Início do Atendimento
              </span>
              <p className="rounded-lg bg-lime-100 px-3 py-2.5 text-sm text-[#1f4e2c]">
                {formatarDataHora(dataInicio)}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold tracking-wide text-[#4bae70] uppercase">
                Término do Atendimento
              </span>
              <p className="rounded-lg bg-lime-100 px-3 py-2.5 text-sm text-[#1f4e2c]">
                {formatarDataHora(agora.toISOString())}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CampoTexto
              rotulo="Horas Trabalhadas *"
              variante="claro"
              type="number"
              min={0}
              step="0.5"
              placeholder="Ex: 2.5"
              mensagemErro={errors.horaEstimada?.message}
              {...register('horaEstimada', { valueAsNumber: true })}
            />
            <CampoTexto
              rotulo="Custo Total (R$) *"
              variante="claro"
              type="number"
              min={0}
              step="0.01"
              placeholder="Ex: 150.00"
              mensagemErro={errors.custo?.message}
              {...register('custo', { valueAsNumber: true })}
            />
          </div>

          <CampoTextoArea
            rotulo="Defeito Constatado *"
            rows={3}
            maxLength={500}
            placeholder="Descreva o defeito efetivamente constatado na máquina..."
            mensagemErro={errors.defeitoConstatado?.message}
            {...register('defeitoConstatado')}
          />

          <CampoTextoArea
            rotulo="Causa Raiz *"
            rows={3}
            maxLength={500}
            placeholder="Descreva a causa raiz identificada..."
            mensagemErro={errors.causaRaiz?.message}
            {...register('causaRaiz')}
          />

          <CampoTextoArea
            rotulo="Solução Aplicada *"
            rows={3}
            maxLength={500}
            placeholder="Descreva a solução aplicada para resolver o problema..."
            mensagemErro={errors.solucao?.message}
            {...register('solucao')}
          />

          <div className="mt-1 flex gap-3">
            <div className="flex-1">
              <Botao type="button" variante="secundario" onClick={aoFechar}>
                Cancelar
              </Botao>
            </div>
            <div className="flex-1">
              <Botao type="submit" className="flex items-center justify-center gap-2">
                <CheckCircle2 size={16} />
                Encerrar OS
              </Botao>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
