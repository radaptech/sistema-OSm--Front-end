import { Alternador } from '../../../componentes/Alternador'
import { CampoSelecao } from '../../../componentes/CampoSelecao'
import { SeletorMultiplo } from '../../../componentes/SeletorMultiplo'
import { LOJAS_MOCK } from '../../../servicos/dadosMockLojas'
import { setoresDisponiveis } from '../../../tipos/maquina'
import { areasTecnico, type AreaTecnico } from '../../../tipos/tecnico'
import type { PerfilLogin } from '../../../tipos/autenticacao'

const OPCOES_LOJAS = LOJAS_MOCK.map((loja) => ({ valor: loja.id, rotulo: loja.nome }))
const OPCOES_SETORES = setoresDisponiveis.map((setor) => ({ valor: setor, rotulo: setor }))

interface CamposAcessoProps {
  role: PerfilLogin
  lojasIds: string[]
  setores: string[]
  acessoTotalSetores: boolean
  area?: AreaTecnico
  aoAlterarLojas: (lojas: string[]) => void
  aoAlterarSetores: (setores: string[]) => void
  aoAlternarAcessoTotal: (valor: boolean) => void
  aoAlterarArea: (area: string) => void
  erroLojas?: string
  erroSetores?: string
  erroArea?: string
}

export function CamposAcesso({
  role,
  lojasIds,
  setores,
  acessoTotalSetores,
  area,
  aoAlterarLojas,
  aoAlterarSetores,
  aoAlternarAcessoTotal,
  aoAlterarArea,
  erroLojas,
  erroSetores,
  erroArea,
}: CamposAcessoProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold tracking-wide text-[#4bae70] uppercase">
          Loja(s) * {role !== 'solicitante' && '(seleção múltipla)'}
        </span>
        <SeletorMultiplo
          opcoes={OPCOES_LOJAS}
          selecionados={lojasIds}
          selecaoUnica={role === 'solicitante'}
          aoAlterar={aoAlterarLojas}
        />
        {erroLojas && <span className="text-xs text-red-500">{erroLojas}</span>}
      </div>

      {role !== 'tecnico' && (
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-wide text-[#4bae70] uppercase">
            Setor(es) * {role === 'gestor' && '(seleção múltipla)'}
          </span>

          {role === 'gestor' && (
            <Alternador
              marcado={acessoTotalSetores}
              aoAlternar={aoAlternarAcessoTotal}
              rotulo="Acesso total aos setores"
              descricao="Concede acesso a todos os setores das lojas selecionadas"
            />
          )}

          {!(role === 'gestor' && acessoTotalSetores) && (
            <>
              <SeletorMultiplo
                opcoes={OPCOES_SETORES}
                selecionados={setores}
                selecaoUnica={role === 'solicitante'}
                aoAlterar={aoAlterarSetores}
              />
              {erroSetores && <span className="text-xs text-red-500">{erroSetores}</span>}
            </>
          )}
        </div>
      )}

      {role === 'tecnico' && (
        <CampoSelecao
          rotulo="Área de Atuação *"
          value={area ?? ''}
          onChange={(evento) => aoAlterarArea(evento.target.value)}
          mensagemErro={erroArea}
        >
          <option value="">Selecionar...</option>
          {areasTecnico.map((areaDisponivel) => (
            <option key={areaDisponivel} value={areaDisponivel}>
              {areaDisponivel}
            </option>
          ))}
        </CampoSelecao>
      )}
    </div>
  )
}
