import { useQuery } from '@tanstack/react-query'
import { servicoEmpresasTerceirizadas } from '../servicos/servicoEmpresasTerceirizadas'

export function useEmpresasTerceirizadas() {
  return useQuery({
    queryKey: ['empresas-terceirizadas'],
    queryFn: servicoEmpresasTerceirizadas.listar,
  })
}
