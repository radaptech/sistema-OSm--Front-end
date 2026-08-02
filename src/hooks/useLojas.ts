import { useQuery } from '@tanstack/react-query'
import { servicoLojas } from '../servicos/servicoLojas'

export function useLojas() {
  return useQuery({
    queryKey: ['lojas'],
    queryFn: servicoLojas.listar,
  })
}
