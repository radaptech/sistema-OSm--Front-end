import { atrasoSimulado } from './atrasoSimulado'
import { servicoTecnicos } from './servicoTecnicos'
import { USUARIOS_MOCK } from './dadosMockUsuarios'
import type { AtualizarUsuarioPayload, NovoUsuarioPayload, Usuario } from '../tipos/usuario'
import type { Tecnico } from '../tipos/tecnico'

export interface ParametrosListagemUsuarios {
  role?: Usuario['role']
  lojaId?: string
}

let proximoId = USUARIOS_MOCK.length + 1

function listar(parametros: ParametrosListagemUsuarios = {}) {
  const filtrados = USUARIOS_MOCK.filter((usuario) => {
    const combinaRole = !parametros.role || usuario.role === parametros.role
    const combinaLoja = !parametros.lojaId || usuario.lojasIds.includes(parametros.lojaId)

    return combinaRole && combinaLoja
  })

  return atrasoSimulado(filtrados)
}

function obterPorId(id: string): Promise<Usuario | undefined> {
  return atrasoSimulado(USUARIOS_MOCK.find((item) => item.id === id))
}

// Desvio deliberado (mesmo padrão do item 9/11 do CLAUDE.md): sem back-end real para o
// CRUD de usuários ainda, então o cadastro roda mock-first. Técnico tem campos e ciclo
// de vida próprios (área, valorHora), então é delegado ao servicoTecnicos — os demais
// perfis (solicitante/gestor/administrador) ficam em USUARIOS_MOCK.
function criar(dados: NovoUsuarioPayload): Promise<Usuario | Tecnico> {
  if (dados.role === 'tecnico') {
    return servicoTecnicos.criar({
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      area: dados.area!,
      lojasIds: dados.lojasIds,
      valorHora: dados.valorHora!,
    })
  }

  const usuario: Usuario = {
    id: `usuario-${proximoId++}`,
    nome: dados.nome,
    telefone: dados.telefone,
    email: dados.email,
    role: dados.role,
    lojasIds: dados.lojasIds,
    setores: dados.setores,
    acessoTotalSetores: dados.acessoTotalSetores,
  }
  USUARIOS_MOCK.push(usuario)

  return atrasoSimulado(usuario)
}

function atualizar({ id, ...dados }: AtualizarUsuarioPayload): Promise<Usuario | undefined> {
  const usuario = USUARIOS_MOCK.find((item) => item.id === id)

  if (usuario) {
    usuario.nome = dados.nome
    usuario.telefone = dados.telefone
    usuario.email = dados.email
    usuario.role = dados.role as Usuario['role']
    usuario.lojasIds = dados.lojasIds
    usuario.setores = dados.setores
    usuario.acessoTotalSetores = dados.acessoTotalSetores
  }

  return atrasoSimulado(usuario)
}

function deletar(id: string): Promise<void> {
  const indice = USUARIOS_MOCK.findIndex((item) => item.id === id)

  if (indice !== -1) {
    USUARIOS_MOCK.splice(indice, 1)
  }

  return atrasoSimulado(undefined)
}

export const servicoUsuarios = {
  listar,
  obterPorId,
  criar,
  atualizar,
  deletar,
}
