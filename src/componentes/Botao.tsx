import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario'
  // Enquanto a ação está em andamento: troca o conteúdo por um indicador e bloqueia o
  // botão. Sem isso, um clique em "Salvar" numa conexão lenta não devolve sinal nenhum e
  // o usuário clica de novo, mandando a mesma coisa duas vezes.
  carregando?: boolean
  rotuloCarregando?: string
}

export function Botao({
  variante = 'primario',
  carregando = false,
  rotuloCarregando = 'Salvando...',
  className = '',
  children,
  disabled,
  ...props
}: BotaoProps) {
  const estilosVariante =
    variante === 'primario'
      ? 'bg-gradient-to-r from-marca-900 to-marca-500 text-white shadow-card hover:shadow-card-hover hover:brightness-110'
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'

  return (
    <button
      // `active:scale` fica sem transição de propósito: é resposta ao toque, e resposta
      // ao toque tem que ser imediata — animar aqui só atrasaria a sensação do clique.
      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-rapido ease-entrada active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${estilosVariante} ${className}`}
      disabled={disabled || carregando}
      aria-busy={carregando}
      {...props}
    >
      {carregando ? (
        <>
          {/* Único giro em loop do sistema, e só enquanto a ação está pendente — some
              assim que o servidor responde. */}
          <Loader2 size={16} className="animate-spin" />
          {rotuloCarregando}
        </>
      ) : (
        children
      )}
    </button>
  )
}
