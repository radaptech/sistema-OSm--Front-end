import { createPortal } from 'react-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Botao } from '../../componentes/Botao'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { useTecnicos } from '../../hooks/useTecnicos'
import { niveisUrgencia, type IdUrgencia } from '../../tipos/ordemServico'
import type { SolicitacaoOS } from '../../tipos/ordemServico'
import {
  esquemaAbrirOrdemServico,
  type DadosAbrirOrdemServico,
} from './esquemaAbrirOrdemServico'
import { useSaidaAnimada } from '../../hooks/useSaidaAnimada'

interface ModalAbrirOrdemServicoProps {
  solicitacao: SolicitacaoOS
  aoFechar: () => void
  aoSalvar: (dados: DadosAbrirOrdemServico) => void
}

const ESTILOS_URGENCIA: Record<IdUrgencia, { ativo: string; inativo: string }> = {
  Baixa: {
    ativo: 'border-emerald-500 bg-emerald-50 text-emerald-700',
    inativo: 'border-slate-200 text-slate-500 hover:border-emerald-300',
  },
  Média: {
    ativo: 'border-amber-500 bg-amber-50 text-amber-700',
    inativo: 'border-slate-200 text-slate-500 hover:border-amber-300',
  },
  Alta: {
    ativo: 'border-red-500 bg-red-50 text-red-700',
    inativo: 'border-slate-200 text-slate-500 hover:border-red-300',
  },
}

export function ModalAbrirOrdemServico({
  solicitacao,
  aoFechar,
  aoSalvar,
}: ModalAbrirOrdemServicoProps) {
  const { fechar, classeFundo, classeCartao } = useSaidaAnimada(aoFechar)

  const { data: tecnicos = [] } = useTecnicos(solicitacao.lojaId)
  const agora = new Date()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DadosAbrirOrdemServico>({
    resolver: zodResolver(esquemaAbrirOrdemServico),
    defaultValues: {
      urgencia: undefined,
      tecnicoId: 0,
    },
  })

  function aoSalvarFormulario(dados: DadosAbrirOrdemServico) {
    aoSalvar(dados)
    fechar()
  }

  return createPortal(
    <div className={`${classeFundo} fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm`}>
      <div className={`${classeCartao} w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-pop`}>
        <div className="flex items-start justify-between bg-gradient-to-r from-marca-900 to-marca-500 px-6 py-4">
          <div>
            <p className="font-mono text-xs font-bold tracking-widest text-white/80 uppercase">
              Painel do Gestor
            </p>
            <p className="font-display text-lg font-bold text-white">
              Abrir OS · #{solicitacao.id}
            </p>
            <p className="text-xs text-white/80">{solicitacao.maquinaNome}</p>
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
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs font-semibold tracking-wide text-marca-500 uppercase">
              Nível de Urgência *
            </span>
            <Controller
              control={control}
              name="urgencia"
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-2">
                  {niveisUrgencia.map((nivel) => {
                    const ativo = field.value === nivel
                    return (
                      <button
                        key={nivel}
                        type="button"
                        onClick={() => field.onChange(nivel)}
                        className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                          ativo
                            ? ESTILOS_URGENCIA[nivel].ativo
                            : ESTILOS_URGENCIA[nivel].inativo
                        }`}
                      >
                        {nivel}
                      </button>
                    )
                  })}
                </div>
              )}
            />
            {errors.urgencia && (
              <span className="text-xs text-red-500">{errors.urgencia.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs font-semibold tracking-wide text-marca-500 uppercase">
              Data/Hora
            </span>
            <p className="rounded-lg bg-lime-100 px-3 py-2.5 font-mono text-sm text-marca-800">
              {agora.toLocaleString('pt-BR')}
            </p>
          </div>

          <Controller
            control={control}
            name="tecnicoId"
            render={({ field }) => (
              <CampoSelecao
                rotulo="Técnico Responsável *"
                mensagemErro={errors.tecnicoId?.message}
                value={field.value || ''}
                onChange={(evento) => field.onChange(Number(evento.target.value))}
              >
                <option value="">Selecionar técnico...</option>
                {tecnicos.map((tecnico) => (
                  <option key={tecnico.id} value={tecnico.id}>
                    {tecnico.nome} — {tecnico.area}
                  </option>
                ))}
              </CampoSelecao>
            )}
          />

          <div className="mt-1 flex gap-3">
            <div className="flex-1">
              <Botao type="button" variante="secundario" onClick={fechar}>
                Cancelar
              </Botao>
            </div>
            <div className="flex-1">
              <Botao type="submit" className="flex items-center justify-center gap-2">
                <CheckCircle2 size={16} />
                Abrir OS
              </Botao>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
