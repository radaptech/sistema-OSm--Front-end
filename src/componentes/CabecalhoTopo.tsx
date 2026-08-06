import { Bell, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useEstadoAutenticacao } from '../estado/estadoAutenticacao'

export function CabecalhoTopo() {
  const navegar = useNavigate()
  const nomeUsuario = useEstadoAutenticacao((estado) => estado.nomeUsuario)
  const sair = useEstadoAutenticacao((estado) => estado.sair)

  function aoSair() {
    sair()
    navegar('/login')
  }

  function aoClicarNotificacoes() {
    toast.info('Nenhuma notificação no momento.')
  }

  return (
    <header className="relative isolate overflow-hidden bg-gradient-to-r from-marca-900 to-marca-500 px-4 py-3 shadow-card sm:px-8">
      <div className="bg-grade-industrial bg-grade pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="font-mono text-xs font-bold tracking-widest text-white uppercase">
            Solicitação OS
          </p>
          <p className="text-sm text-white/90">Olá, {nomeUsuario} 👋</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notificações"
            onClick={aoClicarNotificacoes}
            className="relative text-white/90 transition hover:scale-110 hover:text-white"
          >
            <Bell size={20} />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-white" />
          </button>
          <button
            type="button"
            aria-label="Sair"
            onClick={aoSair}
            className="text-white/90 transition hover:scale-110 hover:text-white"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
