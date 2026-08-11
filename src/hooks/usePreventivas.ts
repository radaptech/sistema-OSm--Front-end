import { useQuery } from '@tanstack/react-query'
import { servicoPreventivas } from '../servicos/servicoPreventivas'

export function usePreventivas(maquinaId?: number) {
  return useQuery({
    queryKey: ['preventivas', { maquinaId }],
    queryFn: () => servicoPreventivas.listar({ maquinaId }),
  })
}
