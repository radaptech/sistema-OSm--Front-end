import { create } from 'zustand'
import type { EscopoAcessoGestor, PerfilLogin } from '../tipos/autenticacao'
import type { Setor } from '../tipos/maquina'

interface OpcoesEntrar {
  lojaId?: string
  setor?: Setor
  escoposGestor?: EscopoAcessoGestor[]
  tecnicoId?: string
}

interface EstadoAutenticacao {
  autenticado: boolean
  perfil: PerfilLogin | null
  nomeUsuario: string | null
  lojaId: string | null
  setor: Setor | null
  escoposGestor: EscopoAcessoGestor[] | null
  tecnicoId: string | null
  entrar: (perfil: PerfilLogin, nomeUsuario: string, opcoes?: OpcoesEntrar) => void
  sair: () => void
}

export const useEstadoAutenticacao = create<EstadoAutenticacao>((set) => ({
  autenticado: false,
  perfil: null,
  nomeUsuario: null,
  lojaId: null,
  setor: null,
  escoposGestor: null,
  tecnicoId: null,
  entrar: (perfil, nomeUsuario, opcoes) =>
    set({
      autenticado: true,
      perfil,
      nomeUsuario,
      lojaId: opcoes?.lojaId ?? null,
      setor: opcoes?.setor ?? null,
      escoposGestor: opcoes?.escoposGestor ?? null,
      tecnicoId: opcoes?.tecnicoId ?? null,
    }),
  sair: () =>
    set({
      autenticado: false,
      perfil: null,
      nomeUsuario: null,
      lojaId: null,
      setor: null,
      escoposGestor: null,
      tecnicoId: null,
    }),
}))
