import { useQuery } from '@tanstack/react-query'
import { servicoTecnicos } from '../servicos/servicoTecnicos'

interface OpcoesUseTecnicos {
  lojaId?: string
}

export function useTecnicos({ lojaId }: OpcoesUseTecnicos = {}) {
  return useQuery({
    queryKey: ['tecnicos', { lojaId }],
    queryFn: () => servicoTecnicos.listar({ lojaId }),
  })
}
