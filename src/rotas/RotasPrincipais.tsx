import { Navigate, Route, Routes } from 'react-router-dom'
import { TelaLogin } from '../paginas/TelaLogin/TelaLogin'
import { HomeSolicitante } from '../paginas/HomeSolicitante/HomeSolicitante'
import { NovaSolicitacaoOS } from '../paginas/NovaSolicitacaoOS/NovaSolicitacaoOS'
import { MinhasSolicitacoes } from '../paginas/MinhasSolicitacoes/MinhasSolicitacoes'
import { CadastrarMaquina } from '../paginas/CadastrarMaquina/CadastrarMaquina'
import { RotaProtegida } from './RotaProtegida'
import { RotaPublica } from './RotaPublica'

export function RotasPrincipais() {
  return (
    <Routes>
      <Route element={<RotaPublica />}>
        <Route path="/login" element={<TelaLogin />} />
      </Route>

      <Route element={<RotaProtegida />}>
        <Route path="/home-solicitante" element={<HomeSolicitante />} />
        <Route path="/nova-solicitacao-os" element={<NovaSolicitacaoOS />} />
        <Route path="/minhas-solicitacoes" element={<MinhasSolicitacoes />} />
        <Route path="/cadastrar-maquina" element={<CadastrarMaquina />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
