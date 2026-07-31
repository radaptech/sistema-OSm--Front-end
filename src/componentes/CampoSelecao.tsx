import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react'

interface CampoSelecaoProps extends SelectHTMLAttributes<HTMLSelectElement> {
  rotulo: string
  mensagemErro?: string
  children: ReactNode
}

export const CampoSelecao = forwardRef<HTMLSelectElement, CampoSelecaoProps>(
  ({ rotulo, mensagemErro, id, className = '', name, children, ...props }, ref) => {
    const selectId = id ?? name

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={selectId}
          className="text-xs font-semibold tracking-wide text-[#4bae70] uppercase"
        >
          {rotulo}
        </label>
        <select
          id={selectId}
          name={name}
          ref={ref}
          className={`w-full rounded-lg border-0 bg-lime-100 px-3 py-2.5 text-sm text-[#1f4e2c] outline-none transition focus:ring-2 focus:ring-[#4bae70] ${
            mensagemErro ? 'ring-2 ring-red-400' : ''
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        {mensagemErro && (
          <span className="text-xs text-red-500">{mensagemErro}</span>
        )}
      </div>
    )
  },
)

CampoSelecao.displayName = 'CampoSelecao'
