import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Truck, XCircle } from 'lucide-react'
import { Botao } from '../../../componentes/Botao'
import { CampoSelecao } from '../../../componentes/CampoSelecao'
import { useEmpresasTerceirizadas } from '../../../hooks/useEmpresasTerceirizadas'
import { obterNomeAlvo } from '../../../utilitarios/alvoOS'
import type { OrdemServico } from '../../../tipos/ordemServico'
import {
  esquemaAcionarTerceiro,
  type DadosAcionarTerceiro,
} from '../esquemaAcionarTerceiro'

interface ModalAcionarTerceiroProps {
  ordemServico: OrdemServico
  aoFechar: () => void
  aoSalvar: (dados: DadosAcionarTerceiro) => void
}

export function ModalAcionarTerceiro({
  ordemServico,
  aoFechar,
  aoSalvar,
}: ModalAcionarTerceiroProps) {
  const { data: empresas = [], isLoading } = useEmpresasTerceirizadas()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosAcionarTerceiro>({
    resolver: zodResolver(esquemaAcionarTerceiro),
    defaultValues: {
      empresaTerceirizadaId: ordemServico.empresaTerceirizadaId,
    },
  })

  function aoSalvarFormulario(dados: DadosAcionarTerceiro) {
    aoSalvar(dados)
    aoFechar()
  }

  return createPortal(
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-pop-in shadow-pop w-full max-w-md overflow-hidden rounded-2xl bg-white">
        <div className="flex items-start justify-between bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div>
            <p className="font-mono text-xs font-bold tracking-widest text-white/80 uppercase">
              Painel do Técnico
            </p>
            <p className="font-display text-lg font-bold text-white">
              Acionar Terceiro · OS #{ordemServico.id}
            </p>
            <p className="text-xs text-white/80">
              {obterNomeAlvo(ordemServico)}
            </p>
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

        <form
          onSubmit={(evento) => {
            evento.stopPropagation()
            handleSubmit(aoSalvarFormulario)(evento)
          }}
          noValidate
          className="flex flex-col gap-5 p-6"
        >
          <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">
            A OS continua sua — os dois relógios seguem correndo e você é quem
            encerra quando a empresa terminar o serviço. Se o atendimento vai
            demorar, use <span className="font-semibold">Pausar</span> para não
            contar essa espera como hora trabalhada.
          </p>

          <CampoSelecao
            rotulo="Empresa Terceirizada *"
            mensagemErro={errors.empresaTerceirizadaId?.message}
            disabled={isLoading || empresas.length === 0}
            {...register('empresaTerceirizadaId', {
              setValueAs: (valor) => (valor === '' ? undefined : Number(valor)),
            })}
          >
            <option value="">
              {isLoading
                ? 'Carregando...'
                : empresas.length === 0
                  ? 'Nenhuma empresa terceirizada cadastrada.'
                  : 'Selecione a empresa...'}
            </option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nome}
                {empresa.especialidade ? ` — ${empresa.especialidade}` : ''}
              </option>
            ))}
          </CampoSelecao>

          <div className="mt-1 flex gap-3">
            <div className="flex-1">
              <Botao type="button" variante="secundario" onClick={aoFechar}>
                Cancelar
              </Botao>
            </div>
            <div className="flex-1">
              <Botao
                type="submit"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600"
              >
                <Truck size={16} />
                Acionar
              </Botao>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
