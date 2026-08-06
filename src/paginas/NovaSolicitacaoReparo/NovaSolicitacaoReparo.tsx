import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Botao } from '../../componentes/Botao'
import { CampoTexto } from '../../componentes/CampoTexto'
import { CampoTextoArea } from '../../componentes/CampoTextoArea'
import { CabecalhoPagina } from '../../componentes/CabecalhoPagina'
import { UploadFoto } from '../../componentes/UploadFoto'
import { useEstadoAutenticacao } from '../../estado/estadoAutenticacao'
import { servicoReparos } from '../../servicos/servicoReparos'
import { formatarDataHora } from '../../utilitarios/formatarData'
import {
  esquemaNovaSolicitacaoReparo,
  type DadosNovaSolicitacaoReparo,
} from './esquemaNovaSolicitacaoReparo'

const LIMITE_CARACTERES_DESCRICAO = 500

export function NovaSolicitacaoReparo() {
  const navegar = useNavigate()
  const [foto, setFoto] = useState<File | null>(null)
  const nomeUsuario = useEstadoAutenticacao((estado) => estado.nomeUsuario)
  const setorUsuario = useEstadoAutenticacao((estado) => estado.setor)
  const lojaIdUsuario = useEstadoAutenticacao((estado) => estado.lojaId)
  const [dataHora] = useState(() => new Date().toISOString())

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DadosNovaSolicitacaoReparo>({
    resolver: zodResolver(esquemaNovaSolicitacaoReparo),
    defaultValues: {
      item: '',
      descricao: '',
      setor: setorUsuario ?? undefined,
      lojaId: lojaIdUsuario ?? '',
      solicitante: nomeUsuario ?? '',
      dataHora,
    },
  })

  const descricao = useWatch({ control, name: 'descricao' }) ?? ''

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (dados: DadosNovaSolicitacaoReparo) =>
      servicoReparos.criar(dados, foto ?? undefined),
  })

  async function aoEnviar(dados: DadosNovaSolicitacaoReparo) {
    await mutateAsync(dados)
    toast.success('Solicitação de reparo enviada com sucesso.')
    reset()
    setFoto(null)
    navegar('/home-solicitante')
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoPagina titulo="Nova Solicitação de Reparo" />

      <main className="flex flex-1 justify-center px-4 py-8">
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="relative isolate overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 py-3 text-center shadow-card">
            <div className="bg-grade-industrial bg-grade pointer-events-none absolute inset-0 opacity-20" />
            <p className="relative font-display text-sm font-bold tracking-widest text-white uppercase">
              Pequenos Reparos
            </p>
          </div>

          <form
            onSubmit={handleSubmit(aoEnviar)}
            noValidate
            className="flex flex-col gap-5 p-6 sm:p-8"
          >
            <UploadFoto
              foto={foto}
              aoSelecionarFoto={setFoto}
              rotulo="Foto do Item"
              textoAlternativo="Pré-visualização do item que precisa de reparo"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <CampoTexto
                rotulo="Item *"
                variante="claro"
                placeholder="Ex: Lâmpada de LED"
                mensagemErro={errors.item?.message}
                {...register('item')}
              />
              <CampoTexto
                rotulo="Solicitante"
                variante="claro"
                readOnly
                {...register('solicitante')}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <CampoTexto
                rotulo="Setor"
                variante="claro"
                readOnly
                {...register('setor')}
              />
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs font-semibold tracking-wider text-marca-500 uppercase">
                  Data/Hora
                </span>
                <p className="rounded-lg bg-lime-100 px-3 py-2.5 font-mono text-sm text-marca-800">
                  {formatarDataHora(dataHora)}
                </p>
              </div>
            </div>

            <div>
              <CampoTextoArea
                rotulo="Descrição *"
                rows={4}
                maxLength={LIMITE_CARACTERES_DESCRICAO}
                placeholder="Ex: Lâmpada de LED do corredor queimou."
                mensagemErro={errors.descricao?.message}
                {...register('descricao')}
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {descricao.length}/{LIMITE_CARACTERES_DESCRICAO}
              </p>
            </div>

            <Botao type="submit" disabled={isPending}>
              {isPending ? 'Enviando...' : 'Enviar Solicitação'}
            </Botao>
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
