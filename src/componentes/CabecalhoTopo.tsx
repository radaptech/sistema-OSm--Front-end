import { Bell, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEstadoAutenticacao } from '../estado/estadoAutenticacao'

export function CabecalhoTopo() {
  const navegar = useNavigate()
  const nomeUsuario = useEstadoAutenticacao((estado) => estado.nomeUsuario)
  const sair = useEstadoAutenticacao((estado) => estado.sair)

  function aoSair() {
    sair()
    navegar('/login')
  }

  return (
    <header className="flex w-full items-center justify-between bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-4 py-3 sm:px-8">
      <div>
        <p className="text-xs font-bold tracking-widest text-white uppercase">
          Solicitação OS
        </p>
        <p className="text-sm text-white">Olá, {nomeUsuario} 👋</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notificações"
          className="relative text-white/90 transition hover:text-white"
        >
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-white" />
        </button>
        <button
          type="button"
          aria-label="Sair"
          onClick={aoSair}
          className="text-white/90 transition hover:text-white"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}
