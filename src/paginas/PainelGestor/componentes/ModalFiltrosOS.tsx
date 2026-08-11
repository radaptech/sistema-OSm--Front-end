import { useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Filter, RotateCcw, Search, XCircle } from 'lucide-react'
import { Botao } from '../../../componentes/Botao'
import { CampoSelecao } from '../../../componentes/CampoSelecao'
import { CampoTexto } from '../../../componentes/CampoTexto'
import type { Loja } from '../../../tipos/loja'
import { FILTROS_AVANCADOS_OS_VAZIOS, type FiltrosAvancadosOS } from '../filtrosOS'

const ID_LISTA_MAQUINAS = 'filtro-os-maquinas-sugeridas'

interface ModalFiltrosOSProps {
  lojas: Loja[]
  maquinas: string[]
  filtros: FiltrosAvancadosOS
  aoFechar: () => void
  aoAplicar: (filtros: FiltrosAvancadosOS) => void
}

export function ModalFiltrosOS({
  lojas,
  maquinas,
  filtros,
  aoFechar,
  aoAplicar,
}: ModalFiltrosOSProps) {
  const [rascunho, setRascunho] = useState<FiltrosAvancadosOS>(filtros)

  const dataInvalida =
    !!rascunho.dataInicio && !!rascunho.dataFim && rascunho.dataInicio > rascunho.dataFim
  const valorInvalido =
    rascunho.valorMinimo !== '' &&
    rascunho.valorMaximo !== '' &&
    Number(rascunho.valorMinimo) > Number(rascunho.valorMaximo)

  function atualizarCampo<Campo extends keyof FiltrosAvancadosOS>(
    campo: Campo,
    valor: FiltrosAvancadosOS[Campo],
  ) {
    setRascunho((atual) => ({ ...atual, [campo]: valor }))
  }

  function aoEnviar(evento: FormEvent) {
    evento.preventDefault()

    if (dataInvalida || valorInvalido) {
      return
    }

    aoAplicar(rascunho)
  }

  return createPortal(
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-pop-in w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-pop">
        <div className="flex items-start justify-between bg-gradient-to-r from-marca-900 to-marca-500 px-6 py-4">
          <div>
            <p className="font-mono text-xs font-bold tracking-widest text-white/80 uppercase">
              Painel do Gestor
            </p>
            <p className="font-display text-lg font-bold text-white">Filtrar OS</p>
            <p className="text-xs text-white/80">Loja, máquina, período e valores</p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={aoFechar}
            className="text-white/90 transition hover:text-white"
          >
            <XCircle size={22} />
          </button>
        </div>

        <form onSubmit={aoEnviar} noValidate className="flex flex-col gap-5 p-6">
          <CampoSelecao
            rotulo="Loja"
            value={rascunho.loja}
            onChange={(evento) => atualizarCampo('loja', evento.target.value)}
          >
            <option value="">Todas as lojas</option>
            {lojas.map((loja) => (
              <option key={loja.id} value={loja.id}>
                {loja.nome}
              </option>
            ))}
          </CampoSelecao>

          <div>
            <CampoTexto
              rotulo="Máquina"
              variante="claro"
              list={ID_LISTA_MAQUINAS}
              placeholder="Digite ou escolha uma máquina..."
              icone={<Search size={16} className="text-marca-500" />}
              value={rascunho.maquina}
              onChange={(evento) => atualizarCampo('maquina', evento.target.value)}
            />
            <datalist id={ID_LISTA_MAQUINAS}>
              {maquinas.map((maquina) => (
                <option key={maquina} value={maquina} />
              ))}
            </datalist>
          </div>

          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-4">
              <CampoTexto
                rotulo="De"
                variante="claro"
                type="date"
                value={rascunho.dataInicio}
                onChange={(evento) => atualizarCampo('dataInicio', evento.target.value)}
              />
              <CampoTexto
                rotulo="Até"
                variante="claro"
                type="date"
                value={rascunho.dataFim}
                onChange={(evento) => atualizarCampo('dataFim', evento.target.value)}
              />
            </div>
            {dataInvalida && (
              <span className="text-xs text-red-500">
                A data final não pode ser anterior à data inicial.
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-4">
              <CampoTexto
                rotulo="Valor Mínimo (R$)"
                variante="claro"
                type="number"
                min={0}
                step="0.01"
                placeholder="0,00"
                value={rascunho.valorMinimo}
                onChange={(evento) => atualizarCampo('valorMinimo', evento.target.value)}
              />
              <CampoTexto
                rotulo="Valor Máximo (R$)"
                variante="claro"
                type="number"
                min={0}
                step="0.01"
                placeholder="0,00"
                value={rascunho.valorMaximo}
                onChange={(evento) => atualizarCampo('valorMaximo', evento.target.value)}
              />
            </div>
            {valorInvalido && (
              <span className="text-xs text-red-500">
                O valor máximo não pode ser menor que o mínimo.
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400">
            O filtro de valor considera o custo total já lançado na OS (Custo Hora do
            Técnico + Custo de Manutenção) — solicitações e OS ainda em andamento não têm
            valor final e ficam de fora quando esse filtro está ativo.
          </p>

          <div className="mt-1 flex gap-3">
            <div className="flex-1">
              <Botao
                type="button"
                variante="secundario"
                onClick={() => setRascunho(FILTROS_AVANCADOS_OS_VAZIOS)}
                className="flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} />
                Limpar
              </Botao>
            </div>
            <div className="flex-1">
              <Botao
                type="submit"
                disabled={dataInvalida || valorInvalido}
                className="flex items-center justify-center gap-2"
              >
                <Filter size={14} />
                Aplicar Filtros
              </Botao>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
