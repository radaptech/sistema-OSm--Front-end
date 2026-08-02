import { useQuery } from '@tanstack/react-query'
import { servicoEmpresas } from '../servicos/servicoEmpresas'

export function useEmpresas() {
  return useQuery({
    queryKey: ['empresas'],
    queryFn: servicoEmpresas.listar,
  })
}
