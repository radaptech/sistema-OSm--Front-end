import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Botao } from '../../componentes/Botao'
import { CampoTextoArea } from '../../componentes/CampoTextoArea'
import { TECNICOS_MOCK } from '../../servicos/dadosMockTecnicos'
import { calcularHoras } from '../../utilitarios/calcularHoras'
import { formatarDataHora } from '../../utilitarios/formatarData'
import { formatarMoeda } from '../../utilitarios/formatarMoeda'
import type { OrdemServico } from '../../tipos/ordemServico'
import {
  esquemaEncerrarOrdemServico,
  type DadosEncerrarOrdemServico,
} from './esquemaEncerrarOrdemServico'

interface DadosConfirmarEncerramento extends DadosEncerrarOrdemServico {
  dataInicio: string
  dataFim: string
  horasTrabalhadas: number
  custoHoraTecnico: number
}

interface ModalEncerrarOrdemServicoProps {
  ordemServico: OrdemServico
  aoFechar: () => void
  aoSalvar: (dados: DadosConfirmarEncerramento) => void
}

export function ModalEncerrarOrdemServico({
  ordemServico,
  aoFechar,
  aoSalvar,
}: ModalEncerrarOrdemServicoProps) {
  const dataInicio = ordemServico.dataInicio ?? ordemServico.dataAbertura
  const agora = new Date()
  const agoraIso = agora.toISOString()

  // Horas Trabalhadas soma o que já foi fechado em sessões anteriores (pausas) com a
  // sessão ativa atual — diferente de Horas Parada, que corre sem interrupção desde a
  // abertura da OS até o encerramento, independente de pausas do técnico.
  const horasSessaoAtual = calcularHoras(
    ordemServico.sessaoAtualInicio ?? dataInicio,
    agoraIso,
  )
  const horasTrabalhadas =
    Math.round(((ordemServico.horasTrabalhadasAcumuladas ?? 0) + horasSessaoAtual) * 100) / 100
  const horasParada = calcularHoras(ordemServico.dataAbertura, agoraIso)
  const tecnico = TECNICOS_MOCK.find((item) => item.id === ordemServico.tecnicoId)
  const valorHoraTecnico = tecnico?.valorHora ?? 0
  const custoHoraTecnico = Math.round(horasTrabalhadas * valorHoraTecnico * 100) / 100

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosEncerrarOrdemServico>({
    resolver: zodResolver(esquemaEncerrarOrdemServico),
    defaultValues: {
      defeitoConstatado: '',
      causaRaiz: '',
      solucao: '',
    },
  })

  function aoSalvarFormulario(dados: DadosEncerrarOrdemServico) {
    aoSalvar({
      ...dados,
      dataInicio,
      dataFim: agoraIso,
      horasTrabalhadas,
      custoHoraTecnico,
    })
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
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="font-mono text-xs font-semibold tracking-wide text-marca-500 uppercase">
              Início do Atendimento
            </span>
            <span className="font-mono text-xs font-semibold tracking-wide text-marca-500 uppercase">
              Término do Atendimento
            </span>
            <p className="rounded-lg bg-lime-100 px-3 py-2.5 font-mono text-sm text-marca-800">
              {formatarDataHora(dataInicio)}
            </p>
            <p className="rounded-lg bg-lime-100 px-3 py-2.5 font-mono text-sm text-marca-800">
              {formatarDataHora(agoraIso)}
            </p>
          </div>

          {/* Rótulos e valores em linhas de grid próprias (em vez de um flex-col por
              coluna) para que, mesmo quando um rótulo quebra em duas linhas e outro não
              (ex: "Custo Hora Técnico" vs "Horas Parada"), os três valores abaixo fiquem
              alinhados na mesma altura. */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-1">
            <span className="font-mono text-xs font-semibold tracking-wide text-marca-500 uppercase">
              Horas Trabalhadas
            </span>
            <span className="font-mono text-xs font-semibold tracking-wide text-marca-500 uppercase">
              Horas Parada
            </span>
            <span className="font-mono text-xs font-semibold tracking-wide text-marca-500 uppercase">
              Custo Hora Técnico
            </span>
            <p className="rounded-lg bg-lime-100 px-3 py-2.5 font-mono text-sm text-marca-800">
              {horasTrabalhadas}h
            </p>
            <p className="rounded-lg bg-lime-100 px-3 py-2.5 font-mono text-sm text-marca-800">
              {horasParada}h
            </p>
            <p className="rounded-lg bg-lime-100 px-3 py-2.5 font-mono text-sm text-marca-800">
              {formatarMoeda(custoHoraTecnico)}
            </p>
          </div>

          <p className="text-xs text-slate-400">
            Horas Trabalhadas desconta o tempo em que a OS ficou pausada (ex: esperando
            peça) — Horas Parada conta corrido desde a abertura, sem descontar pausas. O
            custo de manutenção (peças/nota fiscal) é lançado posteriormente pelo
            Administrador.
          </p>

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
