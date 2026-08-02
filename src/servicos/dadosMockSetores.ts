import { LOJAS_MOCK } from './dadosMockLojas'
import { setoresDisponiveis } from '../tipos/maquina'
import type { SetorCadastrado } from '../tipos/setor'

// Setores se repetem entre lojas: cada loja nasce com o mesmo conjunto padrão de setores.
export const SETORES_MOCK: SetorCadastrado[] = LOJAS_MOCK.flatMap((loja, indiceLoja) =>
  setoresDisponiveis.map((nome, indiceSetor) => ({
    id: `setor-${indiceLoja}-${indiceSetor}`,
    nome,
    lojaId: loja.id,
  })),
)
