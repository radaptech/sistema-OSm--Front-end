import { atrasoSimulado } from './atrasoSimulado'
import { MAQUINAS_MOCK } from './dadosMockMaquinas'
import { PREVENTIVAS_MOCK } from './dadosMockPreventivas'
import type { AtualizarMaquinaPayload, Maquina, NovaMaquinaPayload } from '../tipos/maquina'
import type { PreventivaListada } from '../tipos/maquina'

export interface ParametrosListagemMaquinas {
  setor?: string
  lojaId?: string
}

let proximoIdMaquina = MAQUINAS_MOCK.length + 1
let proximoIdPreventiva = PREVENTIVAS_MOCK.length + 1

function listar(parametros: ParametrosListagemMaquinas = {}) {
  const filtradas = MAQUINAS_MOCK.filter((maquina) => {
    const combinaSetor = !parametros.setor || maquina.setor === parametros.setor
    const combinaLoja = !parametros.lojaId || maquina.lojaId === parametros.lojaId

    return combinaSetor && combinaLoja
  })

  return atrasoSimulado(filtradas)
}

function obterPorId(id: string): Promise<Maquina | undefined> {
  return atrasoSimulado(MAQUINAS_MOCK.find((item) => item.id === id))
}

function registrarPreventivas(maquina: Maquina, dados: NovaMaquinaPayload) {
  for (const preventiva of dados.preventivas) {
    const preventivaListada: PreventivaListada = {
      id: `PREV-NOVA-${proximoIdPreventiva++}`,
      maquinaId: maquina.id,
      maquinaNome: maquina.nome,
      setor: maquina.setor,
      lojaId: maquina.lojaId,
      descricao: preventiva.descricao,
      intervaloDias: preventiva.intervaloDias,
      proximaData: preventiva.proximaData,
      ativa: preventiva.ativa,
    }
    PREVENTIVAS_MOCK.push(preventivaListada)
  }
}

// Desvio deliberado (mesmo padrão do item 9/11 do CLAUDE.md): CRUD completo do
// Administrador precisa funcionar sem back-end real, então opera direto sobre o mock.
function criar(dados: NovaMaquinaPayload, foto?: File): Promise<Maquina> {
  const maquina: Maquina = {
    id: `MAQ-NOVA-${proximoIdMaquina++}`,
    nome: dados.nome,
    tag: dados.tag,
    descricao: dados.descricao,
    marca: dados.marca,
    modelo: dados.modelo,
    criticidade: dados.criticidade,
    setor: dados.setor,
    lojaId: dados.lojaId,
    fotoUrl: foto ? URL.createObjectURL(foto) : undefined,
  }
  MAQUINAS_MOCK.push(maquina)
  registrarPreventivas(maquina, dados)

  return atrasoSimulado(maquina)
}

function atualizar(
  { id, ...dados }: AtualizarMaquinaPayload,
  foto?: File,
): Promise<Maquina | undefined> {
  const maquina = MAQUINAS_MOCK.find((item) => item.id === id)

  if (maquina) {
    maquina.nome = dados.nome
    maquina.tag = dados.tag
    maquina.descricao = dados.descricao
    maquina.marca = dados.marca
    maquina.modelo = dados.modelo
    maquina.criticidade = dados.criticidade
    maquina.setor = dados.setor
    maquina.lojaId = dados.lojaId
    if (foto) {
      maquina.fotoUrl = URL.createObjectURL(foto)
    }

    // Substitui o conjunto de preventivas da máquina pelo enviado no formulário de edição.
    for (let indice = PREVENTIVAS_MOCK.length - 1; indice >= 0; indice -= 1) {
      if (PREVENTIVAS_MOCK[indice].maquinaId === id) {
        PREVENTIVAS_MOCK.splice(indice, 1)
      }
    }
    registrarPreventivas(maquina, dados)
  }

  return atrasoSimulado(maquina)
}

function deletar(id: string): Promise<void> {
  const indice = MAQUINAS_MOCK.findIndex((item) => item.id === id)

  if (indice !== -1) {
    MAQUINAS_MOCK.splice(indice, 1)
  }

  for (let indicePreventiva = PREVENTIVAS_MOCK.length - 1; indicePreventiva >= 0; indicePreventiva -= 1) {
    if (PREVENTIVAS_MOCK[indicePreventiva].maquinaId === id) {
      PREVENTIVAS_MOCK.splice(indicePreventiva, 1)
    }
  }

  return atrasoSimulado(undefined)
}

export const servicoMaquinas = {
  listar,
  obterPorId,
  criar,
  atualizar,
  deletar,
}
