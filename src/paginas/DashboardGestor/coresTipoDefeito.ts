import type { TipoDefeito } from '../../tipos/ordemServico'

// Paleta categórica validada (skill dataviz) — cor fixa por identidade do tipo de
// defeito, nunca por posição/rank, para permanecer estável quando algum tipo não
// aparece na máquina selecionada.
export const CORES_TIPO_DEFEITO: Record<TipoDefeito, string> = {
  Mecânico: '#2a78d6',
  Elétrico: '#eb6834',
  Hidráulico: '#1baf7a',
  Pneumático: '#eda100',
  'Software / CNC': '#e87ba4',
  Estrutural: '#008300',
}
