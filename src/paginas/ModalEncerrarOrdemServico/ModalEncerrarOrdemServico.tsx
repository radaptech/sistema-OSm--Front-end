import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Botao } from '../../componentes/Botao'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { CampoTexto } from '../../componentes/CampoTexto'
import { CampoTextoArea } from '../../componentes/CampoTextoArea'
import { calcularHoras } from '../../utilitarios/calcularHoras'
import { agoraParaBackend } from '../../utilitarios/dataBackend'
import { formatarDataHora } from '../../utilitarios/formatarData'
import { tiposDefeito, type OrdemServico } from '../../tipos/ordemServico'
import {
  criarEsquemaEncerrarOrdemServico,
  type DadosEncerrarOrdemServico,
} from './esquemaEncerrarOrdemServico'
import { useSaidaAnimada } from '../../hooks/useSaidaAnimada'

interface DadosConfirmarEncerramento extends DadosEncerrarOrdemServico {
  dataInicio: string
  dataFim: string
  horasTrabalhadas: number
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
  const { fechar, classeFundo, classeCartao } = useSaidaAnimada(aoFechar)

  const dataInicio = ordemServico.dataInicio ?? ordemServico.dataAbertura
  const agora = agoraParaBackend()
  // Só "Maquinário" cobra Custo Hora Técnico — em 'terceiros' quem trabalhou foi a
  // empresa externa, em 'reparo' o serviço é pequeno demais para justificar hora técnica.
  const exigirCustoHoraTecnico = ordemServico.tipo === 'maquinario'

  // Prévia local, só para o Técnico conferir antes de encerrar. Os valores definitivos
  // são calculados pelo servidor a partir do histórico de pausas e voltam na resposta.
  const horasTrabalhadas = calcularHoras(dataInicio, agora)
  // Só acumula parada a OS marcada como "Afeta Produção": nas demais a máquina seguiu
  // operando, então não existe tempo de parada a exibir nem a calcular.
  const horasParada = ordemServico.afetaProducao
    ? calcularHoras(ordemServico.dataAbertura, agora)
    : undefined

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosEncerrarOrdemServico>({
    resolver: zodResolver(criarEsquemaEncerrarOrdemServico(exigirCustoHoraTecnico)),
    defaultValues: {
      tipoDefeito: undefined,
      defeitoConstatado: '',
      causaRaiz: '',
      solucao: '',
      custoHoraTecnico: undefined,
      custoManutencao: undefined,
    },
  })

  function aoSalvarFormulario(dados: DadosEncerrarOrdemServico) {
    aoSalvar({
      ...dados,
      dataInicio,
      dataFim: agora,
      horasTrabalhadas,
    })
    fechar()
  }

  return createPortal(
    <div className={`${classeFundo} fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm`}>
      <div className={`${classeCartao} shadow-pop w-full max-w-md overflow-hidden rounded-2xl bg-white`}>
        <div className="from-marca-900 to-marca-500 flex items-start justify-between bg-gradient-to-r px-6 py-4">
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
            onClick={fechar}
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
            <span className="text-marca-500 font-mono text-xs font-semibold tracking-wide uppercase">
              Início do Atendimento
            </span>
            <span className="text-marca-500 font-mono text-xs font-semibold tracking-wide uppercase">
              Término do Atendimento
            </span>
            <p className="text-marca-800 rounded-lg bg-lime-100 px-3 py-2.5 font-mono text-sm">
              {formatarDataHora(dataInicio)}
            </p>
            <p className="text-marca-800 rounded-lg bg-lime-100 px-3 py-2.5 font-mono text-sm">
              {formatarDataHora(agora)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-marca-500 font-mono text-xs font-semibold tracking-wide uppercase">
              Horas Trabalhadas
            </span>
            <span className="text-marca-500 font-mono text-xs font-semibold tracking-wide uppercase">
              Horas Parada
            </span>
            <p className="text-marca-800 rounded-lg bg-lime-100 px-3 py-2.5 font-mono text-sm">
              {horasTrabalhadas}h
            </p>
            <p className="text-marca-800 rounded-lg bg-lime-100 px-3 py-2.5 font-mono text-sm">
              {horasParada !== undefined ? `${horasParada}h` : 'Não se aplica'}
            </p>
          </div>

          <p className="text-xs text-slate-400">
            {horasParada !== undefined
              ? 'Horas Trabalhadas desconta o tempo em que a OS ficou pausada (ex: esperando peça) — Horas Parada conta corrido desde a abertura, sem descontar pausas.'
              : 'Horas Trabalhadas desconta o tempo em que a OS ficou pausada (ex: esperando peça). Esta OS não foi marcada como "Afeta Produção": a máquina seguiu operando, então não acumula tempo de parada.'}
          </p>

          {ordemServico.tipo === 'terceiros' && (
            <p className="rounded-lg bg-blue-50 px-3 py-2.5 text-xs text-blue-700">
              Serviço executado por {ordemServico.empresaTerceirizadaNome ?? 'empresa terceirizada'}:
              não há Custo Hora Técnico a lançar aqui, só o Custo de Manutenção (confira contra a
              nota fiscal da empresa).
            </p>
          )}

          {ordemServico.tipo === 'reparo' && (
            <p className="rounded-lg bg-slate-100 px-3 py-2.5 text-xs text-slate-600">
              Pequenos Reparos não têm Custo Hora Técnico — informe apenas o Custo de Manutenção.
            </p>
          )}

          {/* items-end: se um rótulo quebrar em duas linhas, os inputs continuam
              alinhados pela base em vez de um descer sozinho. */}
          <div
            className={`grid items-end gap-4 ${
              exigirCustoHoraTecnico ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {exigirCustoHoraTecnico && (
              <CampoTexto
                rotulo="Custo Hora Técnico (R$) *"
                variante="claro"
                type="number"
                min={0}
                step="0.01"
                placeholder="Ex: 80.00"
                mensagemErro={errors.custoHoraTecnico?.message}
                {...register('custoHoraTecnico', { valueAsNumber: true })}
              />
            )}

            <CampoTexto
              rotulo="Custo Manutenção (R$) *"
              variante="claro"
              type="number"
              min={0}
              step="0.01"
              placeholder="Ex: 120.00"
              mensagemErro={errors.custoManutencao?.message}
              {...register('custoManutencao', { valueAsNumber: true })}
            />
          </div>

          <CampoSelecao
            rotulo="Tipo de OS *"
            mensagemErro={errors.tipoDefeito?.message}
            {...register('tipoDefeito', {
              setValueAs: (valor) => (valor === '' ? undefined : valor),
            })}
          >
            <option value="">Selecione o tipo...</option>
            {tiposDefeito.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </CampoSelecao>

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
              <Botao type="button" variante="secundario" onClick={fechar}>
                Cancelar
              </Botao>
            </div>
            <div className="flex-1">
              <Botao
                type="submit"
                className="flex items-center justify-center gap-2"
              >
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
