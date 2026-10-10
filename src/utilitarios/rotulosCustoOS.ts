import type { TipoOS } from '../tipos/ordemServico'

// Cada tarefa de custo tem dois valores — o material e a mão de obra (`custoManutencao` e
// `custoHoraTecnico` no contrato). O que eles SIGNIFICAM depende de quem executou:
//   - maquinário: "Manutenção" (peça/material) e "Hora do Técnico";
//   - terceiros: "Valor Peças" e "Valor Mão de Obra" — a mão de obra é da EMPRESA
//     externa, como vem separada na nota dela (migration 000016 do back);
//   - reparo: só o material, sem mão de obra cobrada.
// Os rótulos moram aqui para encerramento, custos pendentes e detalhes da OS chamarem
// a mesma coisa pelo mesmo nome.
//
// `material`/`maoDeObra` são os campos de cada tarefa no formulário; `custoMaterial`/
// `custoMaoDeObra` são os totais nas telas de leitura (cards e detalhes da OS).
export interface RotulosCustoOS {
  material: string
  maoDeObra: string
  custoMaterial: string
  custoMaoDeObra: string
}

export function rotulosCustoOS(tipo: TipoOS): RotulosCustoOS {
  return tipo === 'terceiros'
    ? {
        material: 'Valor Peças',
        maoDeObra: 'Valor Mão de Obra',
        custoMaterial: 'Valor Peças',
        custoMaoDeObra: 'Valor Mão de Obra',
      }
    : {
        material: 'Manutenção',
        maoDeObra: 'Hora do Técnico',
        custoMaterial: 'Custo Manutenção',
        custoMaoDeObra: 'Custo Hora do Técnico',
      }
}

// Só Pequenos Reparos não cobra mão de obra — o servidor recusa a coluna nesse tipo.
export function cobraMaoDeObra(tipo: TipoOS): boolean {
  return tipo !== 'reparo'
}
