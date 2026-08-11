import { useQuery } from '@tanstack/react-query'
import { servicoTecnicos } from '../servicos/servicoTecnicos'

export function useTecnicos(lojaId?: number) {
  return useQuery({
    queryKey: ['tecnicos', { lojaId }],
    queryFn: () => servicoTecnicos.listar({ lojaId }),
  })
}
