import { useQuery } from '@tanstack/react-query'
import { servicoOrdensServico } from '../servicos/servicoOrdensServico'
import type { ParametrosListagemOrdensServico } from '../servicos/servicoOrdensServico'

export function useOrdensServicoTodas(
  parametros: ParametrosListagemOrdensServico = {},
) {
  return useQuery({
    queryKey: ['ordens-servico-todas', parametros],
    queryFn: () => servicoOrdensServico.listar(parametros),
  })
}
