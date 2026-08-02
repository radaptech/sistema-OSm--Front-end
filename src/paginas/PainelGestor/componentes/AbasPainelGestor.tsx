export type AbaPainelGestor = 'solicitacoes' | 'os-finalizadas' | 'manutencao-preventiva'

const ABAS: { chave: AbaPainelGestor; rotulo: string }[] = [
  { chave: 'solicitacoes', rotulo: 'Solicitações' },
  { chave: 'os-finalizadas', rotulo: 'OS Finalizadas' },
  { chave: 'manutencao-preventiva', rotulo: 'Manutenção Prev.' },
]

interface AbasPainelGestorProps {
  abaSelecionada: AbaPainelGestor
  aoSelecionarAba: (aba: AbaPainelGestor) => void
}

export function AbasPainelGestor({ abaSelecionada, aoSelecionarAba }: AbasPainelGestorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ABAS.map((aba) => {
        const ativa = aba.chave === abaSelecionada

        return (
          <button
            key={aba.chave}
            type="button"
            onClick={() => aoSelecionarAba(aba.chave)}
            className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
              ativa
                ? 'bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] text-white'
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
