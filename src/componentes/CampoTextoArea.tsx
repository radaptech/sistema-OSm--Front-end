import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface CampoTextoAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rotulo: string
  mensagemErro?: string
}

export const CampoTextoArea = forwardRef<HTMLTextAreaElement, CampoTextoAreaProps>(
  ({ rotulo, mensagemErro, id, className = '', name, ...props }, ref) => {
    const textareaId = id ?? name

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={textareaId}
          className="font-mono text-xs font-semibold tracking-wider text-marca-500 uppercase"
        >
          {rotulo}
        </label>
        <textarea
          id={textareaId}
          name={name}
          ref={ref}
          className={`w-full resize-none rounded-lg border-0 bg-lime-100 px-3 py-2.5 text-sm text-marca-800 placeholder:text-marca-800/40 outline-none transition focus:ring-2 focus:ring-marca-500 ${
            mensagemErro ? 'ring-2 ring-red-400' : ''
          } ${className}`}
          {...props}
        />
        {mensagemErro && (
          <span className="text-xs text-red-500">{mensagemErro}</span>
        )}
      </div>
    )
  },
)

CampoTextoArea.displayName = 'CampoTextoArea'
