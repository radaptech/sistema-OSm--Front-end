import { create } from 'zustand'
import type { PerfilLogin } from '../tipos/autenticacao'

interface EstadoAutenticacao {
  autenticado: boolean
  perfil: PerfilLogin | null
  nomeUsuario: string | null
  entrar: (perfil: PerfilLogin, nomeUsuario: string) => void
  sair: () => void
}

export const useEstadoAutenticacao = create<EstadoAutenticacao>((set) => ({
  autenticado: false,
  perfil: null,
  nomeUsuario: null,
  entrar: (perfil, nomeUsuario) => set({ autenticado: true, perfil, nomeUsuario }),
  sair: () => set({ autenticado: false, perfil: null, nomeUsuario: null }),
}))
