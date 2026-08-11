import { useQuery } from '@tanstack/react-query'
import { servicoOrdensServico } from '../servicos/servicoOrdensServico'

// O servidor restringe às OS do técnico autenticado — o id vai junto apenas para compor
// a chave de cache.
export function useOrdensServicoTecnico(tecnicoId: number | null) {
  return useQuery({
    queryKey: ['ordens-servico-tecnico', tecnicoId],
    queryFn: () => servicoOrdensServico.listar({ tecnicoId: tecnicoId as number }),
    enabled: Boolean(tecnicoId),
  })
}
