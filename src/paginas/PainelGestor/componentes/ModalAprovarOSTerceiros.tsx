import { createPortal } from 'react-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Botao } from '../../../componentes/Botao'
import { CampoSelecao } from '../../../componentes/CampoSelecao'
import { useEmpresasTerceirizadas } from '../../../hooks/useEmpresasTerceirizadas'
import type { SolicitacaoOS } from '../../../tipos/ordemServico'
import {
  esquemaAprovarOSTerceiros,
  type DadosAprovarOSTerceiros,
  type DadosConfirmarAprovacaoTerceiros,
} from '../esquemaAprovarOSTerceiros'

interface ModalAprovarOSTerceirosProps {
  solicitacao: SolicitacaoOS
  aoFechar: () => void
  aoSalvar: (dados: DadosConfirmarAprovacaoTerceiros) => void
}

export function ModalAprovarOSTerceiros({
  solicitacao,
  aoFechar,
  aoSalvar,
}: ModalAprovarOSTerceirosProps) {
  const { data: empresas = [], isLoading: carregandoEmpresas } = useEmpresasTerceirizadas()
  const agora = new Date()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DadosAprovarOSTerceiros>({
    resolver: zodResolver(esquemaAprovarOSTerceiros),
    defaultValues: { empresaTerceirizadaId: '' },
  })

  function aoSalvarFormulario(dados: DadosAprovarOSTerceiros) {
    aoSalvar({ ...dados, dataHora: agora.toISOString() })
    aoFechar()
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-6 py-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-white/80 uppercase">
              Painel do Gestor
            </p>
            <p className="text-lg font-bold text-white">
              Aprovar OS Terceiros · #{solicitacao.id}
            </p>
            <p className="text-xs text-white/80">{solicitacao.maquinaNome}</p>
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
          <p className="text-sm text-slate-500">
            Escolha a empresa terceirizada responsável pelo reparo desta máquina. A OS já
            é registrada como aguardando o lançamento do custo pelo Administrador.
          </p>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-wide text-[#4bae70] uppercase">
              Data/Hora
            </span>
            <p className="rounded-lg bg-lime-100 px-3 py-2.5 text-sm text-[#1f4e2c]">
              {agora.toLocaleString('pt-BR')}
            </p>
          </div>

          <Controller
            control={control}
            name="empresaTerceirizadaId"
            render={({ field }) => (
              <CampoSelecao
                rotulo="Empresa Terceirizada *"
                mensagemErro={errors.empresaTerceirizadaId?.message}
                disabled={carregandoEmpresas || empresas.length === 0}
                value={field.value}
                onChange={field.onChange}
              >
                <option value="">
                  {carregandoEmpresas
                    ? 'Carregando...'
                    : empresas.length === 0
                      ? 'Nenhuma empresa terceirizada cadastrada.'
                      : 'Selecionar empresa...'}
                </option>
                {empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.nome}
                    {empresa.especialidade ? ` — ${empresa.especialidade}` : ''}
                  </option>
                ))}
              </CampoSelecao>
            )}
          />

          <div className="mt-1 flex gap-3">
            <div className="flex-1">
              <Botao type="button" variante="secundario" onClick={aoFechar}>
                Cancelar
              </Botao>
            </div>
            <div className="flex-1">
              <Botao type="submit" className="flex items-center justify-center gap-2">
                <CheckCircle2 size={16} />
                Aprovar
              </Botao>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
