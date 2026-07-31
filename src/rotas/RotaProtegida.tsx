import { Navigate, Outlet } from 'react-router-dom'
import { useEstadoAutenticacao } from '../estado/estadoAutenticacao'

export function RotaProtegida() {
  const autenticado = useEstadoAutenticacao((estado) => estado.autenticado)

  return autenticado ? <Outlet /> : <Navigate to="/login" replace />
}
