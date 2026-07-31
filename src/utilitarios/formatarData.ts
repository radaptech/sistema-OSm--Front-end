export function formatarData(dataIso: string): string {
  return new Date(`${dataIso}T00:00:00`).toLocaleDateString('pt-BR')
}

export function formatarDataHora(dataIso: string): string {
  const data = new Date(dataIso)

  const dataFormatada = data.toLocaleDateString('pt-BR')
  const horaFormatada = data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `${dataFormatada} ${horaFormatada}`
}
