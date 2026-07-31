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
      ? 'bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] text-white hover:brightness-110'
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'

  return (
    <button
      className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${estilosVariante} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
