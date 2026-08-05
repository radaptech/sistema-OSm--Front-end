import { useEffect, useState } from 'react'
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
import { PreviaMaquina } from '../../componentes/PreviaMaquina'
import { UploadFoto } from '../../componentes/UploadFoto'
import { UploadVideo } from '../../componentes/UploadVideo'
import { useMaquinas } from '../../hooks/useMaquinas'
import { useEstadoAutenticacao } from '../../estado/estadoAutenticacao'
import { servicoOSTerceiros } from '../../servicos/servicoOSTerceiros'
import { formatarDataHora } from '../../utilitarios/formatarData'
import { tiposDefeito } from '../../tipos/ordemServico'
import {
  esquemaNovaSolicitacaoOSTerceiros,
  type DadosNovaSolicitacaoOSTerceiros,
} from './esquemaNovaSolicitacaoOSTerceiros'

const LIMITE_CARACTERES_DESCRICAO = 1000

export function NovaSolicitacaoOSTerceiros() {
  const navegar = useNavigate()
  const nomeUsuario = useEstadoAutenticacao((estado) => estado.nomeUsuario)
  const setorUsuario = useEstadoAutenticacao((estado) => estado.setor)
  const lojaIdUsuario = useEstadoAutenticacao((estado) => estado.lojaId)
  const { data: maquinas = [], isLoading: carregandoMaquinas } = useMaquinas({
    setor: setorUsuario ?? undefined,
    lojaId: lojaIdUsuario ?? undefined,
  })
  const [dataHora] = useState(() => new Date().toISOString())
  const [fotoDefeito, setFotoDefeito] = useState<File | null>(null)
  const [videoDefeito, setVideoDefeito] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DadosNovaSolicitacaoOSTerceiros>({
    resolver: zodResolver(esquemaNovaSolicitacaoOSTerceiros),
    defaultValues: {
      maquinaId: '',
      maquinaNome: '',
      tipoDefeito: undefined,
      setor: '',
      lojaId: '',
      solicitante: nomeUsuario ?? '',
      descricao: '',
      dataHora,
    },
  })

  const maquinaIdSelecionada = useWatch({ control, name: 'maquinaId' })
  const descricao = useWatch({ control, name: 'descricao' }) ?? ''
  const maquinaSelecionada = maquinas.find((m) => m.id === maquinaIdSelecionada)

  useEffect(() => {
    setValue('maquinaNome', maquinaSelecionada?.nome ?? '', {
      shouldValidate: Boolean(maquinaSelecionada),
    })
    setValue('setor', maquinaSelecionada?.setor ?? '', {
      shouldValidate: Boolean(maquinaSelecionada),
    })
    setValue('lojaId', maquinaSelecionada?.lojaId ?? '', {
      shouldValidate: Boolean(maquinaSelecionada),
    })
  }, [maquinaSelecionada, setValue])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (dados: DadosNovaSolicitacaoOSTerceiros) =>
      servicoOSTerceiros.criar(dados, fotoDefeito as File, videoDefeito ?? undefined),
  })

  async function aoEnviar(dados: DadosNovaSolicitacaoOSTerceiros) {
    if (!fotoDefeito) {
      toast.error('Anexe uma foto do defeito antes de enviar a solicitação.')
      return
    }

    await mutateAsync(dados)
    toast.success('Solicitação de OS Terceiros enviada com sucesso.')
    reset()
    setFotoDefeito(null)
    setVideoDefeito(null)
    navegar('/home-solicitante')
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoPagina titulo="Nova Solicitação OS Terceiros" />

      <main className="flex flex-1 justify-center px-4 py-8">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-3 text-center">
            <p className="text-sm font-bold tracking-widest text-white uppercase">
              Solicitação OS Terceiros
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
                disabled={carregandoMaquinas || maquinas.length === 0}
                {...register('maquinaId')}
              >
                <option value="">
                  {carregandoMaquinas
                    ? 'Carregando...'
                    : maquinas.length === 0
                      ? 'Nenhuma máquina cadastrada no seu setor.'
                      : 'Selecione uma máquina...'}
                </option>
                {maquinas.map((maquina) => (
                  <option key={maquina.id} value={maquina.id}>
                    {maquina.nome}
                  </option>
                ))}
              </CampoSelecao>

              <PreviaMaquina maquina={maquinaSelecionada} />
            </div>

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
              rotulo="Solicitante"
              variante="claro"
              readOnly
              {...register('solicitante')}
            />

            <CampoTexto
              rotulo="Setor da Máquina"
              variante="claro"
              readOnly
              placeholder="Selecione uma máquina..."
              {...register('setor')}
            />

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold tracking-wide text-[#4bae70] uppercase">
                Data/Hora
              </span>
              <p className="rounded-lg bg-lime-100 px-3 py-2.5 text-sm text-[#1f4e2c]">
                {formatarDataHora(dataHora)}
              </p>
            </div>

            <div className="sm:col-span-2">
              <CampoTextoArea
                rotulo="Descrição do Problema"
                rows={5}
                maxLength={LIMITE_CARACTERES_DESCRICAO}
                placeholder="Descreva o defeito e o motivo do encaminhamento para uma empresa terceirizada..."
                mensagemErro={errors.descricao?.message}
                {...register('descricao')}
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {descricao.length}/{LIMITE_CARACTERES_DESCRICAO}
              </p>
            </div>

            <UploadFoto
              foto={fotoDefeito}
              aoSelecionarFoto={setFotoDefeito}
              rotulo="Foto do Defeito *"
              textoAlternativo="Foto do defeito constatado na máquina"
            />

            <UploadVideo
              video={videoDefeito}
              aoSelecionarVideo={setVideoDefeito}
              rotulo="Vídeo do Defeito (opcional)"
            />

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
