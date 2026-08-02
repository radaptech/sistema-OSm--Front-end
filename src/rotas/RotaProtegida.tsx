import { Navigate, Outlet } from 'react-router-dom'
import { useEstadoAutenticacao } from '../estado/estadoAutenticacao'
import { ROTA_POR_PERFIL } from './rotaPorPerfil'
import type { PerfilLogin } from '../tipos/autenticacao'

interface RotaProtegidaProps {
  perfis?: PerfilLogin[]
}

export function RotaProtegida({ perfis }: RotaProtegidaProps) {
  const autenticado = useEstadoAutenticacao((estado) => estado.autenticado)
  const perfil = useEstadoAutenticacao((estado) => estado.perfil)

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  if (perfis && perfil && !perfis.includes(perfil)) {
    return <Navigate to={ROTA_POR_PERFIL[perfil]} replace />
  }

  return <Outlet />
}
