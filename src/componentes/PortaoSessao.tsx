import { useEffect, type ReactNode } from 'react'
import { useSessao } from '../hooks/useSessao'
import { useEstadoAutenticacao } from '../estado/estadoAutenticacao'
import { CarregandoSessao } from './CarregandoSessao'

interface PortaoSessaoProps {
  children: ReactNode
}

// Restaura a sessão a partir do cookie HttpOnly antes de renderizar qualquer rota. O
// endpoint responde 401 quando não há sessão — o que não é erro, é só "não logado", e por
// isso useSessao não faz retry.
export function PortaoSessao({ children }: PortaoSessaoProps) {
  const { data: sessao, isPending } = useSessao()
  const entrar = useEstadoAutenticacao((estado) => estado.entrar)

  useEffect(() => {
    if (sessao) {
      entrar(sessao)
    }
  }, [sessao, entrar])

  if (isPending) {
    return <CarregandoSessao />
  }

  return <>{children}</>
}
