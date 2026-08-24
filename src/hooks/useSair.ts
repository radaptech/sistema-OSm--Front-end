import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useEstadoAutenticacao } from '../estado/estadoAutenticacao'
import { servicoAutenticacao } from '../servicos/servicoAutenticacao'

// Sair de verdade são três coisas, e faltar qualquer uma quebra o login seguinte:
//
// 1. POST /autenticacao/logout -- só o servidor apaga o cookie HttpOnly. Sem isso a
//    sessão continua válida: o próximo acesso ao /login restaura ela no boot e a
//    RotaPublica joga o usuário direto pro painel, sem nunca mostrar o formulário.
// 2. limpar o cache do react-query -- ['sessao'] tem staleTime: Infinity, então o dado
//    antigo sobrevive ao logout. Com ele em cache e autenticado = false, o PortaoSessao
//    cai na condição (sessao && !autenticado) e trava em "Carregando sessão..." pra
//    sempre, porque o efeito que chama entrar() não roda de novo (a referência de
//    sessao não mudou). Limpar tudo também evita vazar dados do usuário anterior.
// 3. zerar o estado global.
//
// O logout ignora erro de propósito: cookie já expirado responde 401, e isso não pode
// impedir o usuário de sair da tela.
export function useSair() {
  const navegar = useNavigate()
  const clienteQuery = useQueryClient()
  const sair = useEstadoAutenticacao((estado) => estado.sair)

  return async function aoSair() {
    await servicoAutenticacao.sair().catch(() => {})
    clienteQuery.clear()
    sair()
    navegar('/login', { replace: true })
  }
}
