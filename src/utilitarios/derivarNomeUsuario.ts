export function derivarNomeUsuario(email: string): string {
  const parteLocal = email.split('@')[0] ?? ''

  return parteLocal
    .split(/[._-]+/)
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(' ')
}
