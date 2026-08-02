import { useQuery } from '@tanstack/react-query'
import { servicoPreventivas } from '../servicos/servicoPreventivas'

export function usePreventivas() {
  return useQuery({
    queryKey: ['preventivas'],
    queryFn: servicoPreventivas.listar,
  })
}
