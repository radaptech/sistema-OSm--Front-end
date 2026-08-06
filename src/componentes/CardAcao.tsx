import type { LucideIcon } from 'lucide-react'

interface CardAcaoProps {
  titulo: string
  descricao: string
  Icone: LucideIcon
  variante?: 'padrao' | 'destaque' | 'reparo' | 'terceiros'
  aoClicar?: () => void
}

const ESTILOS_VARIANTE: Record<
  NonNullable<CardAcaoProps['variante']>,
  { card: string; icone: string }
> = {
  padrao: { card: 'bg-slate-700', icone: 'bg-emerald-600' },
  destaque: { card: 'bg-emerald-600', icone: 'bg-white/15' },
  // Pequenos Reparos usa uma cor própria (âmbar/laranja) para se diferenciar visualmente
  // da OS de Maquinário (verde), sem reaproveitar o âmbar já usado como cor de "alerta"
  // (BadgeOrigemPreventiva, status Pausada) em outras telas.
  reparo: { card: 'bg-orange-600', icone: 'bg-white/15' },
  // OS Terceiros usa azul para reforçar o caráter "externo/parceiro" do atendimento,
  // sem repetir verde (Maquinário), laranja (Pequenos Reparos) ou âmbar (alerta).
  terceiros: { card: 'bg-blue-600', icone: 'bg-white/15' },
}

export function CardAcao({
  titulo,
  descricao,
  Icone,
  variante = 'padrao',
  aoClicar,
}: CardAcaoProps) {
  const estilos = ESTILOS_VARIANTE[variante]

  return (
    <button
      type="button"
      onClick={aoClicar}
      className={`group flex w-full items-center gap-4 rounded-2xl p-4 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:brightness-110 active:translate-y-0 active:scale-[0.99] ${estilos.card}`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${estilos.icone}`}
      >
        <Icone className="text-white" size={24} />
      </span>
      <span className="flex flex-col">
        <span className="font-display font-semibold text-white">{titulo}</span>
        <span className="text-sm text-slate-200">{descricao}</span>
      </span>
    </button>
  )
}
