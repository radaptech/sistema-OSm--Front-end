export const perfisLogin = ['solicitante', 'tecnico', 'gestor'] as const

export type PerfilLogin = (typeof perfisLogin)[number]
