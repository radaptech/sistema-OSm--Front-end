export interface EmpresaTerceirizada {
  id: number
  nome: string
  especialidade?: string
  telefone?: string
}

export interface NovaEmpresaTerceirizadaPayload {
  nome: string
  especialidade?: string
  telefone?: string
}

export interface AtualizarEmpresaTerceirizadaPayload
  extends NovaEmpresaTerceirizadaPayload {
  id: number
}
