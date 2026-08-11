import { useQuery } from '@tanstack/react-query'
import { servicoSetores } from '../servicos/servicoSetores'

export function useSetores(lojaId?: number) {
  return useQuery({
    queryKey: ['setores', { lojaId }],
    queryFn: () => servicoSetores.listar({ lojaId }),
  })
}
