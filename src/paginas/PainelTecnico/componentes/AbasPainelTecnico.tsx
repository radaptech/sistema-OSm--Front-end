export type AbaPainelTecnico = 'em-aberto' | 'pendentes-pausadas' | 'concluidas'

const ABAS: { chave: AbaPainelTecnico; rotulo: string }[] = [
  { chave: 'em-aberto', rotulo: 'OS em Aberto' },
  { chave: 'pendentes-pausadas', rotulo: 'Pendentes / Pausadas' },
  { chave: 'concluidas', rotulo: 'OS Concluídas' },
]

interface AbasPainelTecnicoProps {
  abaSelecionada: AbaPainelTecnico
  aoSelecionarAba: (aba: AbaPainelTecnico) => void
}

export function AbasPainelTecnico({
  abaSelecionada,
  aoSelecionarAba,
}: AbasPainelTecnicoProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ABAS.map((aba) => {
        const ativa = aba.chave === abaSelecionada

        return (
          <button
            key={aba.chave}
            type="button"
            onClick={() => aoSelecionarAba(aba.chave)}
            className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              ativa
                ? 'bg-gradient-to-r from-marca-900 to-marca-500 text-white shadow-card'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
          >
            {aba.rotulo}
          </button>
        )
      })}
    </div>
  )
}
