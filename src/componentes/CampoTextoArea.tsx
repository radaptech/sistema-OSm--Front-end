import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface CampoTextoAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rotulo: string
  mensagemErro?: string
}

export const CampoTextoArea = forwardRef<HTMLTextAreaElement, CampoTextoAreaProps>(
  ({ rotulo, mensagemErro, id, className = '', name, ...props }, ref) => {
    const textareaId = id ?? name

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={textareaId}
          className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
        >
          {rotulo}
        </label>
        <textarea
          id={textareaId}
          name={name}
          ref={ref}
          className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
            mensagemErro
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200/60 focus:border-marca-500 focus:ring-marca-500/20'
          } ${className}`}
          {...props}
        />
        {mensagemErro && (
          <span className="text-xs font-medium text-red-500">{mensagemErro}</span>
        )}
      </div>
    )
  },
)

CampoTextoArea.displayName = 'CampoTextoArea'
