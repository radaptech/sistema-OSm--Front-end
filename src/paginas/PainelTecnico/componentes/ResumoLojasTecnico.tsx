import { Store } from 'lucide-react'
import type { Loja } from '../../../tipos/loja'
import type { OrdemServico } from '../../../tipos/ordemServico'

interface ResumoLojasTecnicoProps {
  ordensServico: OrdemServico[]
  lojas: Loja[]
  lojaSelecionada: number | null
  aoSelecionarLoja: (lojaId: number | null) => void
}

interface ResumoLoja {
  lojaId: number
  lojaNome: string
  totalAbertas: number
}

// Mesmo critério da aba "OS em Aberto" (Aberta + Em Andamento) — ver PainelTecnico.tsx.
// Contar só 'Aberta' aqui bateria número diferente do que a aba mostra ao clicar.
function contaComoAberta(ordem: OrdemServico): boolean {
  return ordem.statusExecucao === 'Aberta' || ordem.statusExecucao === 'Em Andamento'
}

// Um Técnico pode atender várias lojas ao mesmo tempo (ver `lojasIds` em Tecnico) — sem
// isso, as OS de lojas diferentes ficam todas misturadas na mesma lista. Cada pílula é ao
// mesmo tempo um filtro e um aviso: o número vermelho é quantas OS estão em aberto
// (aguardando início ou em andamento) naquela loja, para o Técnico ver de longe onde tem
// trabalho pendente sem precisar rolar a tela toda.
export function ResumoLojasTecnico({
  ordensServico,
  lojas,
  lojaSelecionada,
  aoSelecionarLoja,
}: ResumoLojasTecnicoProps) {
  const resumosPorLoja = new Map<number, ResumoLoja>()

  for (const ordem of ordensServico) {
    const existente = resumosPorLoja.get(ordem.lojaId)
    const lojaNome =
      existente?.lojaNome ??
      (lojas.find((loja) => loja.id === ordem.lojaId)?.nome ?? ordem.lojaNome)

    resumosPorLoja.set(ordem.lojaId, {
      lojaId: ordem.lojaId,
      lojaNome,
      totalAbertas: (existente?.totalAbertas ?? 0) + (contaComoAberta(ordem) ? 1 : 0),
    })
  }

  const resumos = [...resumosPorLoja.values()].sort((a, b) =>
    a.lojaNome.localeCompare(b.lojaNome, 'pt-BR'),
  )

  // Com uma loja só, o filtro não separa nada — só ocuparia espaço à toa.
  if (resumos.length <= 1) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => aoSelecionarLoja(null)}
        className={`rounded-full px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
          lojaSelecionada === null
            ? 'bg-white text-slate-800 shadow-card'
            : 'bg-white/10 text-slate-300 hover:bg-white/20'
        }`}
      >
        Todas as lojas
      </button>

      {resumos.map((resumo) => {
        const ativa = lojaSelecionada === resumo.lojaId

        return (
          <button
            key={resumo.lojaId}
            type="button"
            onClick={() => aoSelecionarLoja(ativa ? null : resumo.lojaId)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              ativa
                ? 'bg-white text-slate-800 shadow-card'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Store size={13} />
            {resumo.lojaNome}
            {resumo.totalAbertas > 0 && (
              <span
                className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 font-mono text-[10px] font-bold text-white"
                title={`${resumo.totalAbertas} OS em aberto (aguardando início ou em andamento)`}
              >
                {resumo.totalAbertas}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
