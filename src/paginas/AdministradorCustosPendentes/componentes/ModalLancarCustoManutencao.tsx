import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Botao } from '../../../componentes/Botao'
import { CampoTexto } from '../../../componentes/CampoTexto'
import { obterNomeAlvo } from '../../../utilitarios/alvoOS'
import { formatarDataHora } from '../../../utilitarios/formatarData'
import type { OrdemServico } from '../../../tipos/ordemServico'
import {
  esquemaLancarCustoManutencao,
  type DadosLancarCustoManutencao,
} from '../esquemaLancarCustoManutencao'

interface ModalLancarCustoManutencaoProps {
  ordemServico: OrdemServico
  aoFechar: () => void
  aoSalvar: (dados: DadosLancarCustoManutencao) => void
}

export function ModalLancarCustoManutencao({
  ordemServico,
  aoFechar,
  aoSalvar,
}: ModalLancarCustoManutencaoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosLancarCustoManutencao>({
    resolver: zodResolver(esquemaLancarCustoManutencao),
    defaultValues: {
      custoHoraTecnico: ordemServico.custo?.custoHoraTecnico ?? undefined,
      custoManutencao: ordemServico.custo?.custoManutencao,
    },
  })

  function aoSalvarFormulario(dados: DadosLancarCustoManutencao) {
    aoSalvar(dados)
    aoFechar()
  }

  return createPortal(
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-pop-in shadow-pop w-full max-w-md overflow-hidden rounded-2xl bg-white">
        <div className="from-marca-900 to-marca-500 flex items-start justify-between bg-gradient-to-r px-6 py-4">
          <div>
            <p className="font-mono text-xs font-bold tracking-widest text-white/80 uppercase">
              Painel do Administrador
            </p>
            <p className="font-display text-lg font-bold text-white">
              Lançar Custos · OS #{ordemServico.id}
            </p>
            <p className="text-xs text-white/80">
              {obterNomeAlvo(ordemServico)}
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
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Encerrada em
              </p>
              <p className="font-mono text-slate-700">
                {ordemServico.dataFim
                  ? formatarDataHora(ordemServico.dataFim)
                  : '—'}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Horas Trabalhadas
              </p>
              <p className="font-mono text-slate-700">
                {ordemServico.horasTrabalhadas !== undefined
                  ? `${ordemServico.horasTrabalhadas}h`
                  : '—'}
              </p>
            </div>
          </div>

          {/* O serviço saiu de uma empresa externa: o valor a conferir é o da nota dela. */}
          {ordemServico.empresaTerceirizadaNome && (
            <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">
              Serviço executado por{' '}
              <span className="font-semibold">
                {ordemServico.empresaTerceirizadaNome}
              </span>{' '}
              — confira o Custo de Manutenção contra a nota fiscal da empresa.
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <CampoTexto
              rotulo="Custo Hora Técnico (R$)"
              variante="claro"
              type="number"
              min={0}
              step="0.01"
              placeholder="Ex: 80.00"
              mensagemErro={errors.custoHoraTecnico?.message}
              {...register('custoHoraTecnico', { valueAsNumber: true })}
            />

            <CampoTexto
              rotulo="Custo de Manutenção (R$) *"
              variante="claro"
              type="number"
              min={0}
              step="0.01"
              placeholder="Ex: 120.00"
              mensagemErro={errors.custoManutencao?.message}
              {...register('custoManutencao', { valueAsNumber: true })}
            />
          </div>

          <div className="mt-1 flex gap-3">
            <div className="flex-1">
              <Botao type="button" variante="secundario" onClick={aoFechar}>
                Cancelar
              </Botao>
            </div>
            <div className="flex-1">
              <Botao
                type="submit"
                className="flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                Salvar Custos
              </Botao>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
