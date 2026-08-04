import { Search } from 'lucide-react'

interface CampoBuscaProps {
  valor: string
  aoMudar: (valor: string) => void
  placeholder?: string
}

export function CampoBusca({ valor, aoMudar, placeholder = 'Buscar...' }: CampoBuscaProps) {
  return (
    <div className="relative flex-1">
      <Search
        size={18}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
      />
      <input
        type="search"
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-white py-2.5 pr-4 pl-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#4bae70]"
      />
    </div>
  )
}
