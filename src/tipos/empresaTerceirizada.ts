export interface EmpresaTerceirizada {
  id: string
  nome: string
  especialidade?: string
  telefone?: string
}

export interface NovaEmpresaTerceirizadaPayload {
  nome: string
  especialidade?: string
  telefone?: string
}

export interface AtualizarEmpresaTerceirizadaPayload extends NovaEmpresaTerceirizadaPayload {
  id: string
}
