import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

interface CampoTextoProps extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string
  mensagemErro?: string
  icone?: ReactNode
  variante?: 'padrao' | 'claro'
}

const ESTILOS_ROTULO = {
  padrao: 'text-sm font-medium text-slate-700',
  claro: 'font-mono text-xs font-semibold tracking-wider text-marca-500 uppercase',
}

const ESTILOS_INPUT = {
  padrao:
    'border border-slate-300 bg-white text-slate-900 focus:ring-emerald-500',
  claro:
    'border-0 bg-lime-100 text-marca-800 placeholder:text-marca-800/40 focus:ring-marca-500',
}

export const CampoTexto = forwardRef<HTMLInputElement, CampoTextoProps>(
  (
    {
      rotulo,
      mensagemErro,
      icone,
      variante = 'padrao',
      id,
      className = '',
      name,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? name

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className={ESTILOS_ROTULO[variante]}>
          {rotulo}
        </label>
        <div className="relative">
          <input
            id={inputId}
            name={name}
            ref={ref}
            className={`w-full rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${ESTILOS_INPUT[variante]} ${
              icone ? 'pr-10' : ''
            } ${mensagemErro ? 'ring-2 ring-red-400' : ''} ${className}`}
            {...props}
          />
          {icone && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              {icone}
            </div>
          )}
        </div>
        {mensagemErro && (
          <span className="text-xs text-red-500">{mensagemErro}</span>
        )}
      </div>
    )
  },
)

CampoTexto.displayName = 'CampoTexto'
