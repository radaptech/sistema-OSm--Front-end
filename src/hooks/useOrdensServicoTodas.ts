import { useQuery } from '@tanstack/react-query'
import { servicoOrdensServico } from '../servicos/servicoOrdensServico'

export function useOrdensServicoTodas() {
  return useQuery({
    queryKey: ['ordens-servico-todas'],
    queryFn: servicoOrdensServico.listarTodas,
  })
}
