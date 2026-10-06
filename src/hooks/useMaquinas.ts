import { useQuery } from '@tanstack/react-query'
import { servicoMaquinas } from '../servicos/servicoMaquinas'

interface ParametrosUseMaquinas {
  setorId?: number
  lojaId?: number
  ativa?: false
}

export function useMaquinas({ setorId, lojaId, ativa }: ParametrosUseMaquinas = {}) {
  return useQuery({
    queryKey: ['maquinas', { setorId, lojaId, ativa }],
    queryFn: () => servicoMaquinas.listar({ setorId, lojaId, ativa }),
  })
}
