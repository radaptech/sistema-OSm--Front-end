import { useQuery } from '@tanstack/react-query'
import { servicoSetores } from '../servicos/servicoSetores'

interface OpcoesUseSetores {
  lojaId?: string
}

export function useSetores({ lojaId }: OpcoesUseSetores = {}) {
  return useQuery({
    queryKey: ['setores', { lojaId }],
    queryFn: () => servicoSetores.listar({ lojaId }),
  })
}
