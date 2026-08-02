import { useQuery } from '@tanstack/react-query'
import { servicoMaquinas } from '../servicos/servicoMaquinas'
import type { Setor } from '../tipos/maquina'

interface OpcoesUseMaquinas {
  habilitado?: boolean
  setor?: Setor
  lojaId?: string
}

export function useMaquinas({
  habilitado = true,
  setor,
  lojaId,
}: OpcoesUseMaquinas = {}) {
  return useQuery({
    queryKey: ['maquinas', { setor, lojaId }],
    queryFn: () => servicoMaquinas.listar({ setor, lojaId }),
    enabled: habilitado,
  })
}
