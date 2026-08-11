import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { PortaoSessao } from './componentes/PortaoSessao'
import { RotasPrincipais } from './rotas/RotasPrincipais'

const clienteQuery = new QueryClient({
  defaultOptions: {
    queries: {
      // O api.ts já trata 401 globalmente (toast + redireciono ao login); repetir a
      // requisição só atrasaria esse caminho.
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={clienteQuery}>
      <BrowserRouter>
        <PortaoSessao>
          <RotasPrincipais />
        </PortaoSessao>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
