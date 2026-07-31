import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { RotasPrincipais } from './rotas/RotasPrincipais'

const clienteQuery = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={clienteQuery}>
      <BrowserRouter>
        <RotasPrincipais />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
