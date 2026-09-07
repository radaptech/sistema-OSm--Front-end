import { createPortal } from 'react-dom'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Alternador } from '../../../componentes/Alternador'
import { Botao } from '../../../componentes/Botao'
import { CampoTexto } from '../../../componentes/CampoTexto'
import { CampoTextoArea } from '../../../componentes/CampoTextoArea'
import { obterNomeAlvo } from '../../../utilitarios/alvoOS'
import { formatarDataHora } from '../../../utilitarios/formatarData'
import { formatarHoras } from '../../../utilitarios/formatarHoras'
import type { OrdemServico } from '../../../tipos/ordemServico'
import {
  esquemaLancarCustoManutencao,
  type DadosLancarCustoManutencao,
} from '../esquemaLancarCustoManutencao'
import { useSaidaAnimada } from '../../../hooks/useSaidaAnimada'

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
  const { fechar, classeFundo, classeCartao } = useSaidaAnimada(aoFechar)

  const ehTerceiros = ordemServico.tipo === 'terceiros'
  // Só "Maquinário" cobra Custo Hora Técnico — Pequenos Reparos e OS de terceiros não.
  const mostrarCustoHoraTecnico = ordemServico.tipo === 'maquinario'

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosLancarCustoManutencao>({
    resolver: zodResolver(esquemaLancarCustoManutencao),
    defaultValues: {
      custoHoraTecnico: ordemServico.custo?.custoHoraTecnico ?? undefined,
      custoManutencao: ordemServico.custo?.custoManutencao,
      temNotaFiscal: ordemServico.custo?.temNotaFiscal ?? false,
      numeroNotaFiscal: ordemServico.custo?.numeroNotaFiscal ?? '',
      serieNotaFiscal: ordemServico.custo?.serieNotaFiscal ?? '',
      descricaoServicoTerceiro: ordemServico.custo?.descricaoServicoTerceiro ?? '',
    },
  })

  // Reage ao alternador na hora: os campos de nota aparecem/somem sem esperar submit.
  // useWatch, e não watch(), porque só ele é memoizável (react-hooks/incompatible-library).
  const temNotaFiscal = useWatch({ control, name: 'temNotaFiscal' })

  // Os campos de NF desmontam quando o alternador desliga, mas o React Hook Form guarda
  // o valor digitado: sem limpar aqui, desmarcar e salvar mandaria número/série junto de
  // temNotaFiscal:false e o servidor recusaria (ck_custo_nota_fiscal, 400).
  function aoSalvarFormulario(dados: DadosLancarCustoManutencao) {
    aoSalvar(
      dados.temNotaFiscal
        ? dados
        : { ...dados, numeroNotaFiscal: undefined, serieNotaFiscal: undefined },
    )
    fechar()
  }

  return createPortal(
    <div className={`${classeFundo} fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm`}>
      <div className={`${classeCartao} shadow-pop w-full max-w-md overflow-hidden rounded-2xl bg-white`}>
        <div className="flex items-start justify-between bg-marca-600 px-6 py-4">
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
                  ? formatarHoras(ordemServico.horasTrabalhadas)
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
              — não há Custo Hora Técnico aqui, confira só o Custo de Manutenção contra a
              nota fiscal da empresa.
            </p>
          )}

          {ordemServico.tipo === 'reparo' && (
            <p className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
              Pequenos Reparos não têm Custo Hora Técnico — só o Custo de Manutenção.
            </p>
          )}

          {/* items-end: se um rótulo quebrar em duas linhas, os inputs continuam
              alinhados pela base em vez de um descer sozinho. */}
          <div
            className={`grid items-end gap-4 ${
              mostrarCustoHoraTecnico ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {mostrarCustoHoraTecnico && (
              <CampoTexto
                rotulo="Custo Hora Técnico (R$)"
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
              type="number"
              min={0}
              step="0.01"
              placeholder="Ex: 120.00"
              mensagemErro={errors.custoManutencao?.message}
              {...register('custoManutencao', { valueAsNumber: true })}
            />
          </div>

          {/* Quem declara é o Técnico, no encerramento — este alternador é o conserto
              para quando ele esquece: sem ele, uma OS marcada como "sem nota" ficaria sem
              lugar nenhum para lançar o documento que o Administrador tem na mão.
              Desmarcar apaga número e série no servidor (ck_custo_nota_fiscal). */}
          <Controller
            control={control}
            name="temNotaFiscal"
            render={({ field }) => (
              <Alternador
                id={field.name}
                rotulo="Teve nota fiscal?"
                descricao="Declarado pelo Técnico no encerramento — corrija aqui se estiver errado."
                marcado={field.value}
                aoAlternar={field.onChange}
              />
            )}
          />

          {/* Nota fiscal vale em qualquer tipo (migration 000010), mas os campos só
              aparecem quando alguém declarou que houve nota: uma OS de mão de obra pura
              não deve pedir um documento que não existe. */}
          {temNotaFiscal && (
            <div className="grid grid-cols-2 gap-4">
              <CampoTexto
                rotulo="Número da Nota Fiscal"
                placeholder="Ex: 12345"
                mensagemErro={errors.numeroNotaFiscal?.message}
                {...register('numeroNotaFiscal')}
              />

              <CampoTexto
                rotulo="Série"
                placeholder="Ex: 1"
                mensagemErro={errors.serieNotaFiscal?.message}
                {...register('serieNotaFiscal')}
              />
            </div>
          )}

          {/* A descrição continua só em terceiros: ela conta o que a EMPRESA EXTERNA fez.
              Nos outros tipos quem fez foi o Técnico, e isso já está no encerramento
              (defeito/causa/solução) — repetir aqui seria pedir o mesmo texto duas vezes.
              O back recusa este campo fora de terceiros (ck_custo_por_tipo). */}
          {ehTerceiros && (
            <CampoTextoArea
              rotulo="Descrição do Serviço"
              rows={3}
              maxLength={300}
              placeholder="Descreva o que foi feito pela empresa terceirizada, conforme a nota fiscal..."
              mensagemErro={errors.descricaoServicoTerceiro?.message}
              {...register('descricaoServicoTerceiro')}
            />
          )}

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
