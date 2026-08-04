import { Alternador } from '../../../componentes/Alternador'
import { CampoSelecao } from '../../../componentes/CampoSelecao'
import { CampoTexto } from '../../../componentes/CampoTexto'
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
  valorHora?: number
  aoAlterarLojas: (lojas: string[]) => void
  aoAlterarSetores: (setores: string[]) => void
  aoAlternarAcessoTotal: (valor: boolean) => void
  aoAlterarArea: (area: string) => void
  aoAlterarValorHora: (valorHora: number) => void
  erroLojas?: string
  erroSetores?: string
  erroArea?: string
  erroValorHora?: string
}

export function CamposAcesso({
  role,
  lojasIds,
  setores,
  acessoTotalSetores,
  area,
  valorHora,
  aoAlterarLojas,
  aoAlterarSetores,
  aoAlternarAcessoTotal,
  aoAlterarArea,
  aoAlterarValorHora,
  erroLojas,
  erroSetores,
  erroArea,
  erroValorHora,
}: CamposAcessoProps) {
  if (role === 'administrador') {
    return (
      <p className="rounded-lg bg-lime-50 px-4 py-3 text-sm text-[#1f4e2c]">
        Administrador tem acesso total ao tenant, sem restrição de loja ou setor.
      </p>
    )
  }

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
        <div className="grid gap-5 sm:grid-cols-2">
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

          <CampoTexto
            rotulo="Valor/Hora (R$) *"
            variante="claro"
            type="number"
            min={0}
            step="0.01"
            placeholder="Ex: 45.00"
            value={valorHora ?? ''}
            onChange={(evento) => aoAlterarValorHora(evento.target.valueAsNumber)}
            mensagemErro={erroValorHora}
          />
        </div>
      )}
    </div>
  )
}
