import { create } from 'zustand'
import type { EscopoAcessoGestor, PerfilLogin } from '../tipos/autenticacao'

interface EstadoAutenticacao {
  autenticado: boolean
  perfil: PerfilLogin | null
  nomeUsuario: string | null
  escoposGestor: EscopoAcessoGestor[] | null
  entrar: (
    perfil: PerfilLogin,
    nomeUsuario: string,
    escoposGestor?: EscopoAcessoGestor[],
  ) => void
  sair: () => void
}

export const useEstadoAutenticacao = create<EstadoAutenticacao>((set) => ({
  autenticado: false,
  perfil: null,
  nomeUsuario: null,
  escoposGestor: null,
  entrar: (perfil, nomeUsuario, escoposGestor) =>
    set({
      autenticado: true,
      perfil,
      nomeUsuario,
      escoposGestor: escoposGestor ?? null,
    }),
  sair: () =>
    set({ autenticado: false, perfil: null, nomeUsuario: null, escoposGestor: null }),
}))
