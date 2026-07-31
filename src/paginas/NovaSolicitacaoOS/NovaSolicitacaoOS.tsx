import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Botao } from '../../componentes/Botao'
import { CampoTexto } from '../../componentes/CampoTexto'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { CampoTextoArea } from '../../componentes/CampoTextoArea'
import { CabecalhoPagina } from '../../componentes/CabecalhoPagina'
import { useMaquinas } from '../../hooks/useMaquinas'
import { useEstadoAutenticacao } from '../../estado/estadoAutenticacao'
import { servicoSolicitacoes } from '../../servicos/servicoSolicitacoes'
import { tiposDefeito } from '../../tipos/ordemServico'
import {
  esquemaNovaSolicitacaoOS,
  type DadosNovaSolicitacaoOS,
} from './esquemaNovaSolicitacaoOS'
import { PreviaMaquina } from './componentes/PreviaMaquina'

const LIMITE_CARACTERES_DESCRICAO = 1000

export function NovaSolicitacaoOS() {
  const navegar = useNavigate()
  const nomeUsuario = useEstadoAutenticacao((estado) => estado.nomeUsuario)
  const { data: maquinas = [], isLoading: carregandoMaquinas } = useMaquinas()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DadosNovaSolicitacaoOS>({
    resolver: zodResolver(esquemaNovaSolicitacaoOS),
    defaultValues: {
      maquinaId: '',
      tipoDefeito: undefined,
      setor: '',
      solicitante: nomeUsuario ?? '',
      descricao: '',
    },
  })

  const maquinaIdSelecionada = useWatch({ control, name: 'maquinaId' })
  const descricao = useWatch({ control, name: 'descricao' }) ?? ''
  const maquinaSelecionada = maquinas.find((m) => m.id === maquinaIdSelecionada)

  useEffect(() => {
    setValue('setor', maquinaSelecionada?.setor ?? '', {
      shouldValidate: Boolean(maquinaSelecionada),
    })
  }, [maquinaSelecionada, setValue])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: servicoSolicitacoes.criar,
  })

  async function aoEnviar(dados: DadosNovaSolicitacaoOS) {
    await mutateAsync(dados)
    toast.success('Solicitação enviada com sucesso.')
    reset()
    navegar('/home-solicitante')
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoPagina titulo="Nova Solicitação OS" />

      <main className="flex flex-1 justify-center px-4 py-8">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] py-3 text-center">
            <p className="text-sm font-bold tracking-widest text-white uppercase">
              Nova Ordem de Serviço
            </p>
          </div>

          <form
            onSubmit={handleSubmit(aoEnviar)}
            noValidate
            className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8"
          >
            <div className="flex flex-col gap-3">
              <CampoSelecao
                rotulo="Máquina"
                mensagemErro={errors.maquinaId?.message}
                disabled={carregandoMaquinas}
                {...register('maquinaId')}
              >
                <option value="">
                  {carregandoMaquinas ? 'Carregando...' : 'Selecione uma máquina...'}
                </option>
                {maquinas.map((maquina) => (
                  <option key={maquina.id} value={maquina.id}>
                    {maquina.nome}
                  </option>
                ))}
              </CampoSelecao>

              <PreviaMaquina maquina={maquinaSelecionada} />
            </div>

            <CampoTexto
              rotulo="Solicitante"
              variante="claro"
              readOnly
              {...register('solicitante')}
            />

            <CampoSelecao
              rotulo="Tipo de Defeito"
              mensagemErro={errors.tipoDefeito?.message}
              {...register('tipoDefeito')}
            >
              <option value="">Selecione o tipo...</option>
              {tiposDefeito.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </CampoSelecao>

            <CampoTexto
              rotulo="Setor da Máquina"
              variante="claro"
              readOnly
              placeholder="Selecione uma máquina..."
              {...register('setor')}
            />

            <div className="sm:col-span-2">
              <CampoTextoArea
                rotulo="Descrição do Problema"
                rows={5}
                maxLength={LIMITE_CARACTERES_DESCRICAO}
                placeholder="Descreva o problema da máquina..."
                mensagemErro={errors.descricao?.message}
                {...register('descricao')}
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {descricao.length}/{LIMITE_CARACTERES_DESCRICAO}
              </p>
            </div>

            <div className="sm:col-span-2">
              <Botao type="submit" disabled={isPending}>
                {isPending ? 'Enviando...' : 'Enviar Solicitação'}
              </Botao>
            </div>
          </form>
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
