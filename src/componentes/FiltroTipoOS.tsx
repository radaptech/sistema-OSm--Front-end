import type { TipoOS } from '../tipos/ordemServico'
import { CampoSelecao } from './CampoSelecao'

interface FiltroTipoOSProps {
  valor: TipoOS | ''
  aoMudar: (valor: TipoOS | '') => void
}

const OPCOES: { valor: TipoOS | ''; rotulo: string }[] = [
  { valor: '', rotulo: 'Todos os tipos' },
  { valor: 'maquinario', rotulo: 'Maquinário' },
  { valor: 'terceiros', rotulo: 'Terceiros' },
  { valor: 'reparo', rotulo: 'Pequenos Reparos' },
]

export function FiltroTipoOS({ valor, aoMudar }: FiltroTipoOSProps) {
  return (
    <CampoSelecao
      rotulo="Tipo de OS"
      value={valor}
      onChange={(evento) => aoMudar(evento.target.value as TipoOS | '')}
    >
      {OPCOES.map((opcao) => (
        <option key={opcao.valor} value={opcao.valor}>
          {opcao.rotulo}
        </option>
      ))}
    </CampoSelecao>
  )
}
