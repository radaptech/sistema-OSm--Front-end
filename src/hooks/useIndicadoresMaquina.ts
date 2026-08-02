import { useQuery } from '@tanstack/react-query'
import { servicoIndicadores } from '../servicos/servicoIndicadores'

export function useIndicadoresMaquina(maquinaId: string | null) {
  return useQuery({
    queryKey: ['indicadores-maquina', maquinaId],
    queryFn: () => servicoIndicadores.obterPorMaquina(maquinaId as string),
    enabled: Boolean(maquinaId),
  })
}
