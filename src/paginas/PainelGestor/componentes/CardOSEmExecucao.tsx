import { BadgeStatusExecucao } from '../../../componentes/BadgeStatusExecucao'
import { BadgeTipoOS } from '../../../componentes/BadgeTipoOS'
import { BadgeUrgencia } from '../../../componentes/BadgeUrgencia'
import { TECNICOS_MOCK } from '../../../servicos/dadosMockTecnicos'
import { calcularHoras } from '../../../utilitarios/calcularHoras'
import { formatarDataHora } from '../../../utilitarios/formatarData'
import type { OrdemServico } from '../../../tipos/ordemServico'

interface CardOSEmExecucaoProps {
  ordemServico: OrdemServico
}

export function CardOSEmExecucao({ ordemServico }: CardOSEmExecucaoProps) {
  const tecnico = TECNICOS_MOCK.find((item) => item.id === ordemServico.tecnicoId)

  const horasTrabalhadasAteAgora =
    Math.round(
      ((ordemServico.horasTrabalhadasAcumuladas ?? 0) +
        (ordemServico.sessaoAtualInicio
          ? calcularHoras(ordemServico.sessaoAtualInicio, new Date().toISOString())
          : 0)) *
        100,
    ) / 100

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ${
        ordemServico.statusExecucao === 'Pausada' ? 'border-l-4 border-amber-400' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] text-sm font-bold text-white">
          #{ordemServico.id}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-800">{ordemServico.maquinaNome}</span>
            <span className="text-sm text-slate-400">· {ordemServico.maquinaCodigo}</span>
            <BadgeStatusExecucao status={ordemServico.statusExecucao} />
            <BadgeTipoOS tipo={ordemServico.tipo} />
            {ordemServico.urgencia && <BadgeUrgencia urgencia={ordemServico.urgencia} />}
          </div>
          <p className="mt-1 text-sm text-slate-500">{ordemServico.descricao}</p>
          <p className="mt-1 text-xs text-slate-400">
            Técnico:{' '}
            <span className="font-medium text-slate-500">
              {tecnico ? `${tecnico.nome} — ${tecnico.area}` : '—'}
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Aberta em {formatarDataHora(ordemServico.dataAbertura)}
            {ordemServico.dataInicio &&
              ` · Iniciada em ${formatarDataHora(ordemServico.dataInicio)}`}
            {' · '}
            {horasTrabalhadasAteAgora}h trabalhadas até agora
          </p>
        </div>
      </div>

      {ordemServico.statusExecucao === 'Pausada' && ordemServico.motivoPausa && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Motivo da pausa: {ordemServico.motivoPausa}
        </p>
      )}
    </div>
  )
}
