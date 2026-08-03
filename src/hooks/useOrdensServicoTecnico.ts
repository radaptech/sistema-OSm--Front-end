import { useQuery } from '@tanstack/react-query'
import { servicoOrdensServico } from '../servicos/servicoOrdensServico'

export function useOrdensServicoTecnico(tecnicoId: string | null) {
  return useQuery({
    queryKey: ['ordens-servico-tecnico', tecnicoId],
    queryFn: () => servicoOrdensServico.listarPorTecnico({ tecnicoId: tecnicoId as string }),
    enabled: !!tecnicoId,
  })
}
