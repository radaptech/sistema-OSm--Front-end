import { CirclePlus, ClipboardList, PackagePlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Cabecalho } from './componentes/Cabecalho'
import { CardAcao } from './componentes/CardAcao'
import { CardEstatistica } from './componentes/CardEstatistica'

const ESTATISTICAS_MOCK = [
  { valor: 0, rotulo: 'Abertas' },
  { valor: 0, rotulo: 'Em andamento' },
  { valor: 0, rotulo: 'Concluídas' },
]

export function HomeSolicitante() {
  const navegar = useNavigate()

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <Cabecalho />

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            O que deseja fazer?
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Selecione uma das opções abaixo para continuar.
          </p>
        </div>

        <div className="flex w-full max-w-md flex-col gap-4">
          <CardAcao
            titulo="Minhas Solicitações"
            descricao="Veja todas as OS que você enviou"
            Icone={ClipboardList}
            aoClicar={() => navegar('/minhas-solicitacoes')}
          />
          <CardAcao
            titulo="Nova Solicitação OS"
            descricao="Abra uma nova ordem de serviço"
            Icone={CirclePlus}
            variante="destaque"
            aoClicar={() => navegar('/nova-solicitacao-os')}
          />
          <CardAcao
            titulo="Adicionar Nova Máquina"
            descricao="Cadastre uma nova máquina no sistema"
            Icone={PackagePlus}
            aoClicar={() => navegar('/cadastrar-maquina')}
          />
        </div>

        <div className="grid w-full max-w-md grid-cols-3 gap-2 sm:gap-3">
          {ESTATISTICAS_MOCK.map((estatistica) => (
            <CardEstatistica key={estatistica.rotulo} {...estatistica} />
          ))}
        </div>
      </main>

      <footer className="py-4 text-center">
        <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Solicitação OS © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  )
}
