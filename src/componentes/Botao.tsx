import type { ButtonHTMLAttributes } from 'react'

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario'
}

export function Botao({
  variante = 'primario',
  className = '',
  children,
  ...props
}: BotaoProps) {
  const estilosVariante =
    variante === 'primario'
      ? 'bg-gradient-to-r from-marca-900 to-marca-500 text-white shadow-card hover:shadow-card-hover hover:brightness-110'
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'

  return (
    <button
      className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${estilosVariante} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
