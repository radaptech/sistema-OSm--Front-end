import { useQuery } from '@tanstack/react-query'
import { servicoMaquinas } from '../servicos/servicoMaquinas'

interface ParametrosUseMaquinas {
  setorId?: number
  lojaId?: number
}

export function useMaquinas({ setorId, lojaId }: ParametrosUseMaquinas = {}) {
  return useQuery({
    queryKey: ['maquinas', { setorId, lojaId }],
    queryFn: () => servicoMaquinas.listar({ setorId, lojaId }),
  })
}
