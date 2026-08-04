import type { Setor } from './maquina'

export const perfisLogin = ['solicitante', 'tecnico', 'gestor', 'administrador'] as const

export type PerfilLogin = (typeof perfisLogin)[number]

// setores: 'todos' = acesso a todos os setores da loja; Setor[] = acesso restrito a setores específicos
export interface EscopoAcessoGestor {
  lojaId: string
  setores: Setor[] | 'todos'
}
