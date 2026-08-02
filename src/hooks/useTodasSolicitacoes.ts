import { useQuery } from '@tanstack/react-query'
import { servicoSolicitacoes } from '../servicos/servicoSolicitacoes'

export function useTodasSolicitacoes() {
  return useQuery({
    queryKey: ['solicitacoes-os-todas'],
    queryFn: servicoSolicitacoes.listarTodas,
  })
}
