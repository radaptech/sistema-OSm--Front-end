import { Navigate, Route, Routes } from 'react-router-dom'
import { TelaLogin } from '../paginas/TelaLogin/TelaLogin'
import { HomeSolicitante } from '../paginas/HomeSolicitante/HomeSolicitante'
import { NovaSolicitacaoOS } from '../paginas/NovaSolicitacaoOS/NovaSolicitacaoOS'
import { MinhasSolicitacoes } from '../paginas/MinhasSolicitacoes/MinhasSolicitacoes'
import { CadastrarMaquina } from '../paginas/CadastrarMaquina/CadastrarMaquina'
import { PainelGestor } from '../paginas/PainelGestor/PainelGestor'
import { CadastrarUsuario } from '../paginas/CadastrarUsuario/CadastrarUsuario'
import { CadastrarSetor } from '../paginas/CadastrarSetor/CadastrarSetor'
import { CadastrarLoja } from '../paginas/CadastrarLoja/CadastrarLoja'
import { DashboardGestor } from '../paginas/DashboardGestor/DashboardGestor'
import { PainelTecnico } from '../paginas/PainelTecnico/PainelTecnico'
import { RotaProtegida } from './RotaProtegida'
import { RotaPublica } from './RotaPublica'

export function RotasPrincipais() {
  return (
    <Routes>
      <Route element={<RotaPublica />}>
        <Route path="/login" element={<TelaLogin />} />
      </Route>

      <Route element={<RotaProtegida perfis={['solicitante', 'tecnico']} />}>
        <Route path="/home-solicitante" element={<HomeSolicitante />} />
        <Route path="/nova-solicitacao-os" element={<NovaSolicitacaoOS />} />
        <Route path="/minhas-solicitacoes" element={<MinhasSolicitacoes />} />
        <Route path="/cadastrar-maquina" element={<CadastrarMaquina />} />
      </Route>

      <Route element={<RotaProtegida perfis={['tecnico']} />}>
        <Route path="/painel-tecnico" element={<PainelTecnico />} />
      </Route>

      <Route element={<RotaProtegida perfis={['gestor']} />}>
        <Route path="/painel-gestor" element={<PainelGestor />} />
        <Route path="/cadastrar-usuario" element={<CadastrarUsuario />} />
        <Route path="/cadastrar-setor" element={<CadastrarSetor />} />
        <Route path="/cadastrar-loja" element={<CadastrarLoja />} />
        <Route path="/dashboard-gestor" element={<DashboardGestor />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
