import { Navigate, Route, Routes } from 'react-router-dom'
import { TelaLogin } from '../paginas/TelaLogin/TelaLogin'
import { HomeSolicitante } from '../paginas/HomeSolicitante/HomeSolicitante'
import { NovaSolicitacao } from '../paginas/NovaSolicitacao/NovaSolicitacao'
import { MinhasSolicitacoes } from '../paginas/MinhasSolicitacoes/MinhasSolicitacoes'
import { PainelGestor } from '../paginas/PainelGestor/PainelGestor'
import { DashboardGestor } from '../paginas/DashboardGestor/DashboardGestor'
import { PainelTecnico } from '../paginas/PainelTecnico/PainelTecnico'
import { PainelAdministrador } from '../paginas/PainelAdministrador/PainelAdministrador'
import { AdministradorUsuarios } from '../paginas/AdministradorUsuarios/AdministradorUsuarios'
import { AdministradorLojas } from '../paginas/AdministradorLojas/AdministradorLojas'
import { AdministradorSetores } from '../paginas/AdministradorSetores/AdministradorSetores'
import { AdministradorTecnicos } from '../paginas/AdministradorTecnicos/AdministradorTecnicos'
import { AdministradorMaquinas } from '../paginas/AdministradorMaquinas/AdministradorMaquinas'
import { AdministradorCustosPendentes } from '../paginas/AdministradorCustosPendentes/AdministradorCustosPendentes'
import { AdministradorOSFinalizadas } from '../paginas/AdministradorOSFinalizadas/AdministradorOSFinalizadas'
import { AdministradorEmpresasTerceirizadas } from '../paginas/AdministradorEmpresasTerceirizadas/AdministradorEmpresasTerceirizadas'
import { CadastrarUsuario } from '../paginas/CadastrarUsuario/CadastrarUsuario'
import { CadastrarSetor } from '../paginas/CadastrarSetor/CadastrarSetor'
import { CadastrarLoja } from '../paginas/CadastrarLoja/CadastrarLoja'
import { CadastrarMaquina } from '../paginas/CadastrarMaquina/CadastrarMaquina'
import { CadastrarEmpresaTerceirizada } from '../paginas/CadastrarEmpresaTerceirizada/CadastrarEmpresaTerceirizada'
import { RotaProtegida } from './RotaProtegida'
import { RotaPublica } from './RotaPublica'

export function RotasPrincipais() {
  return (
    <Routes>
      <Route element={<RotaPublica />}>
        <Route path="/login" element={<TelaLogin />} />
      </Route>

      <Route element={<RotaProtegida perfis={['solicitante']} />}>
        <Route path="/home-solicitante" element={<HomeSolicitante />} />
        <Route path="/nova-solicitacao" element={<NovaSolicitacao />} />
        <Route path="/minhas-solicitacoes" element={<MinhasSolicitacoes />} />

        {/* As três telas viraram uma só. As rotas antigas continuam válidas como atalho,
            redirecionando com o tipo já selecionado, para não quebrar link salvo. */}
        <Route
          path="/nova-solicitacao-os"
          element={<Navigate to="/nova-solicitacao?tipo=maquinario" replace />}
        />
        <Route
          path="/nova-solicitacao-reparo"
          element={<Navigate to="/nova-solicitacao?tipo=reparo" replace />}
        />
        {/* Terceiros deixou de ser um tipo que o Solicitante abre: virou decisão do
            Técnico durante a execução. A rota antiga cai na tela padrão. */}
        <Route
          path="/nova-solicitacao-os-terceiros"
          element={<Navigate to="/nova-solicitacao" replace />}
        />
      </Route>

      <Route element={<RotaProtegida perfis={['tecnico']} />}>
        <Route path="/painel-tecnico" element={<PainelTecnico />} />
      </Route>

      <Route element={<RotaProtegida perfis={['gestor']} />}>
        <Route path="/painel-gestor" element={<PainelGestor />} />
        <Route path="/dashboard-gestor" element={<DashboardGestor />} />
      </Route>

      <Route element={<RotaProtegida perfis={['administrador']} />}>
        <Route path="/painel-administrador" element={<PainelAdministrador />} />

        <Route
          path="/administrador/usuarios"
          element={<AdministradorUsuarios />}
        />
        <Route path="/cadastrar-usuario" element={<CadastrarUsuario />} />
        <Route path="/cadastrar-usuario/:id" element={<CadastrarUsuario />} />

        <Route path="/administrador/lojas" element={<AdministradorLojas />} />
        <Route path="/cadastrar-loja" element={<CadastrarLoja />} />
        <Route path="/cadastrar-loja/:id" element={<CadastrarLoja />} />

        <Route
          path="/administrador/setores"
          element={<AdministradorSetores />}
        />
        <Route path="/cadastrar-setor" element={<CadastrarSetor />} />
        <Route path="/cadastrar-setor/:id" element={<CadastrarSetor />} />

        <Route
          path="/administrador/tecnicos"
          element={<AdministradorTecnicos />}
        />

        <Route
          path="/administrador/maquinas"
          element={<AdministradorMaquinas />}
        />
        <Route path="/cadastrar-maquina" element={<CadastrarMaquina />} />
        <Route path="/cadastrar-maquina/:id" element={<CadastrarMaquina />} />

        <Route
          path="/administrador/custos-pendentes"
          element={<AdministradorCustosPendentes />}
        />
        <Route
          path="/administrador/os-finalizadas"
          element={<AdministradorOSFinalizadas />}
        />

        <Route
          path="/administrador/empresas-terceirizadas"
          element={<AdministradorEmpresasTerceirizadas />}
        />
        <Route
          path="/cadastrar-empresa-terceirizada"
          element={<CadastrarEmpresaTerceirizada />}
        />
        <Route
          path="/cadastrar-empresa-terceirizada/:id"
          element={<CadastrarEmpresaTerceirizada />}
        />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
