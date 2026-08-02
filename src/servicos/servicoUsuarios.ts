import { api } from './api'
import type { NovoUsuarioPayload } from '../tipos/usuario'

export const servicoUsuarios = {
  cadastrar: (dados: NovoUsuarioPayload) => api.post('/usuarios', dados),
}
