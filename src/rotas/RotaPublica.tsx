import { Navigate, Outlet } from 'react-router-dom'
import { useEstadoAutenticacao } from '../estado/estadoAutenticacao'

export function RotaPublica() {
  const autenticado = useEstadoAutenticacao((estado) => estado.autenticado)

  return autenticado ? <Navigate to="/home-solicitante" replace /> : <Outlet />
}
