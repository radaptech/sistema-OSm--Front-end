interface OpcaoSelecaoMultipla {
  valor: string
  rotulo: string
}

interface SeletorMultiploProps {
  opcoes: OpcaoSelecaoMultipla[]
  selecionados: string[]
  aoAlterar: (selecionados: string[]) => void
  selecaoUnica?: boolean
}

export function SeletorMultiplo({
  opcoes,
  selecionados,
  aoAlterar,
  selecaoUnica = false,
}: SeletorMultiploProps) {
  function aoClicarOpcao(valor: string) {
    if (selecaoUnica) {
      aoAlterar([valor])
      return
    }

    aoAlterar(
      selecionados.includes(valor)
        ? selecionados.filter((item) => item !== valor)
        : [...selecionados, valor],
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {opcoes.map((opcao) => {
        const ativo = selecionados.includes(opcao.valor)

        return (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => aoClicarOpcao(opcao.valor)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
              ativo
                ? 'bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {opcao.rotulo}
          </button>
        )
      })}
    </div>
  )
}
