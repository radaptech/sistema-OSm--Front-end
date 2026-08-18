import {
  Building2,
  CircleDollarSign,
  ClipboardCheck,
  Store,
  Tag,
  UserCog,
  Users,
  Wrench,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CabecalhoTopo } from '../../componentes/CabecalhoTopo'
import { CardAcao } from '../../componentes/CardAcao'

export function PainelAdministrador() {
  const navegar = useNavigate()

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoTopo />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8 lg:max-w-5xl">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <UserCog className="text-marca-300" size={20} />
            <h1 className="font-display text-xl font-bold text-white sm:text-2xl">
              Painel do Administrador
            </h1>
          </div>
          <p className="text-sm text-slate-300">
            Acesso total ao tenant — gerencie usuários, lojas, setores e máquinas do
            sistema.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
          <CardAcao
            titulo="Usuários"
            descricao="Solicitantes, gestores e administradores"
            Icone={Users}
            variante="destaque"
            aoClicar={() => navegar('/administrador/usuarios')}
          />
          <CardAcao
            titulo="Lojas"
            descricao="Unidades e filiais do tenant"
            Icone={Store}
            aoClicar={() => navegar('/administrador/lojas')}
          />
          <CardAcao
            titulo="Setores"
            descricao="Setores cadastrados por loja"
            Icone={Tag}
            aoClicar={() => navegar('/administrador/setores')}
          />
          <CardAcao
            titulo="Máquinas"
            descricao="Cadastro de máquinas e preventivas"
            Icone={Wrench}
            aoClicar={() => navegar('/administrador/maquinas')}
          />
          <CardAcao
            titulo="Empresas Terceirizadas"
            descricao="Empresas parceiras para reparo de máquinas"
            Icone={Building2}
            aoClicar={() => navegar('/administrador/empresas-terceirizadas')}
          />
          <CardAcao
            titulo="Custos Pendentes"
            descricao="Lançar custo de manutenção das OS concluídas"
            Icone={CircleDollarSign}
            aoClicar={() => navegar('/administrador/custos-pendentes')}
          />
          <CardAcao
            titulo="OS Finalizadas"
            descricao="OS concluídas com custo já lançado — visualizar e imprimir"
            Icone={ClipboardCheck}
            aoClicar={() => navegar('/administrador/os-finalizadas')}
          />
        </div>
      </main>

      <footer className="py-4 text-center">
        <span className="font-mono text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Solicitação OS © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  )
}
