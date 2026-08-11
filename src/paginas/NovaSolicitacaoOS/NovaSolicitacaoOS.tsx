import { useState } from 'react'
import { useForm, useWatch, Controller } from 'react-hook-form'
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
import { formatarDataHora } from '../../utilitarios/formatarData'
import { agoraParaBackend } from '../../utilitarios/dataBackend'
import { marcadoresImpacto, tiposDefeito } from '../../tipos/ordemServico'
import {
  esquemaNovaSolicitacaoOS,
  type DadosNovaSolicitacaoOS,
} from './esquemaNovaSolicitacaoOS'
import { PreviaMaquina } from '../../componentes/PreviaMaquina'
import { UploadFoto } from '../../componentes/UploadFoto'
import { UploadVideo } from '../../componentes/UploadVideo'

const LIMITE_CARACTERES_DESCRICAO = 1000

export function NovaSolicitacaoOS() {
  const navegar = useNavigate()
  const nomeUsuario = useEstadoAutenticacao((estado) => estado.nomeUsuario)
  const setorIdUsuario = useEstadoAutenticacao((estado) => estado.setorId)
  const lojaIdUsuario = useEstadoAutenticacao((estado) => estado.lojaId)
  const { data: maquinas = [], isLoading: carregandoMaquinas } = useMaquinas({
    setorId: setorIdUsuario ?? undefined,
    lojaId: lojaIdUsuario ?? undefined,
  })
  // Exibido como confirmação; o instante gravado é o do servidor.
  const [dataHora] = useState(() => agoraParaBackend())
  const [fotoDefeito, setFotoDefeito] = useState<File | null>(null)
  const [videoDefeito, setVideoDefeito] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DadosNovaSolicitacaoOS>({
    resolver: zodResolver(esquemaNovaSolicitacaoOS),
    defaultValues: {
      maquinaId: 0,
      tipoDefeito: undefined as unknown as DadosNovaSolicitacaoOS['tipoDefeito'],
      descricao: '',
      impactos: [],
    },
  })

  const maquinaIdSelecionada = useWatch({ control, name: 'maquinaId' })
  const descricao = useWatch({ control, name: 'descricao' }) ?? ''
  const maquinaSelecionada = maquinas.find((m) => m.id === maquinaIdSelecionada)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (dados: DadosNovaSolicitacaoOS) =>
      servicoSolicitacoes.criar(dados, fotoDefeito as File, videoDefeito ?? undefined),
  })

  async function aoEnviar(dados: DadosNovaSolicitacaoOS) {
    if (!fotoDefeito) {
      toast.error('Anexe uma foto do defeito antes de enviar a solicitação.')
      return
    }

    await mutateAsync(dados)
    toast.success('Solicitação enviada com sucesso.')
    reset()
    setFotoDefeito(null)
    setVideoDefeito(null)
    navegar('/home-solicitante')
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoPagina titulo="Nova Solicitação OS" />

      <main className="flex flex-1 justify-center px-4 py-8">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="relative isolate overflow-hidden bg-gradient-to-r from-marca-900 to-marca-500 py-3 text-center shadow-card">
            <div className="bg-grade-industrial bg-grade pointer-events-none absolute inset-0 opacity-20" />
            <p className="relative font-display text-sm font-bold tracking-widest text-white uppercase">
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
                disabled={carregandoMaquinas || maquinas.length === 0}
                {...register('maquinaId', { valueAsNumber: true })}
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

            <CampoTexto
              rotulo="Solicitante"
              variante="claro"
              readOnly
              value={nomeUsuario ?? ''}
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
              value={maquinaSelecionada?.setorNome ?? ''}
            />

            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs font-semibold tracking-wider text-marca-500 uppercase">
                Data/Hora
              </span>
              <p className="rounded-lg bg-lime-100 px-3 py-2.5 font-mono text-sm text-marca-800">
                {formatarDataHora(dataHora)}
              </p>
            </div>

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

            <div className="flex flex-col gap-2 sm:col-span-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-marca-500 uppercase">
                Marcadores de Impacto
              </span>
              <Controller
                control={control}
                name="impactos"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {marcadoresImpacto.map((marcador) => {
                      const marcado = field.value.includes(marcador)
                      return (
                        <label
                          key={marcador}
                          className={`flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 font-mono text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                            marcado
                              ? 'bg-gradient-to-r from-marca-900 to-marca-500 text-white shadow-card'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={marcado}
                            onChange={() =>
                              field.onChange(
                                marcado
                                  ? field.value.filter((item) => item !== marcador)
                                  : [...field.value, marcador],
                              )
                            }
                            className="sr-only"
                          />
                          {marcador}
                        </label>
                      )
                    })}
                  </div>
                )}
              />
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
        <span className="font-mono text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Solicitação OS © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  )
}
