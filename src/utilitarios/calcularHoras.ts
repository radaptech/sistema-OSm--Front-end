// Diferença em horas entre dois instantes ISO, arredondada a 2 casas decimais.
export function calcularHoras(inicioIso: string, fimIso: string): number {
  const diferencaMs = new Date(fimIso).getTime() - new Date(inicioIso).getTime()

  return Math.round((diferencaMs / 3600000) * 100) / 100
}
