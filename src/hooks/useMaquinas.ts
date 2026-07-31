import { useQuery } from '@tanstack/react-query'
import { servicoMaquinas } from '../servicos/servicoMaquinas'

interface OpcoesUseMaquinas {
  habilitado?: boolean
}

export function useMaquinas({ habilitado = true }: OpcoesUseMaquinas = {}) {
  return useQuery({
    queryKey: ['maquinas'],
    queryFn: servicoMaquinas.listar,
    enabled: habilitado,
  })
}
