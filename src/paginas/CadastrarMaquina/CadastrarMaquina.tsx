import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CheckCircle2, PackagePlus } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { Botao } from '../../componentes/Botao'
import { CampoTexto } from '../../componentes/CampoTexto'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { CampoTextoArea } from '../../componentes/CampoTextoArea'
import { CabecalhoSubpagina } from '../../componentes/CabecalhoSubpagina'
import { servicoMaquinas } from '../../servicos/servicoMaquinas'
import { servicoPreventivas } from '../../servicos/servicoPreventivas'
import { LOJAS_MOCK } from '../../servicos/dadosMockLojas'
import { niveisCriticidade, setoresDisponiveis } from '../../tipos/maquina'
import {
  esquemaCadastrarMaquina,
  type DadosCadastrarMaquina,
} from './esquemaCadastrarMaquina'
import { UploadFoto } from '../../componentes/UploadFoto'
import { CampoPreventivas } from './componentes/CampoPreventivas'

const VALORES_PADRAO = {
  tag: '',
  nome: '',
  descricao: '',
  marca: '',
  modelo: '',
  criticidade: undefined,
  setor: undefined,
  lojaId: '',
  preventivas: [],
}

export function CadastrarMaquina() {
  const navegar = useNavigate()
  const { id } = useParams<{ id: string }>()
  const emEdicao = Boolean(id)
  const [foto, setFoto] = useState<File | null>(null)

  const { data: maquinaExistente } = useQuery({
    queryKey: ['maquina', id],
    queryFn: () => servicoMaquinas.obterPorId(id as string),
    enabled: emEdicao,
  })

  const { data: preventivasExistentes = [] } = useQuery({
    queryKey: ['preventivas-da-maquina', id],
    queryFn: () => servicoPreventivas.listar(),
    enabled: emEdicao,
    select: (preventivas) => preventivas.filter((preventiva) => preventiva.maquinaId === id),
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DadosCadastrarMaquina>({
    resolver: zodResolver(esquemaCadastrarMaquina),
    defaultValues: VALORES_PADRAO,
  })

  useEffect(() => {
    if (!maquinaExistente) {
      return
    }

    reset({
      ...VALORES_PADRAO,
      tag: maquinaExistente.tag ?? '',
      nome: maquinaExistente.nome,
      descricao: maquinaExistente.descricao ?? '',
      marca: maquinaExistente.marca ?? '',
      modelo: maquinaExistente.modelo ?? '',
      criticidade: maquinaExistente.criticidade,
      setor: maquinaExistente.setor,
      lojaId: maquinaExistente.lojaId,
      preventivas: preventivasExistentes.map((preventiva) => ({
        maquinaId: 'nova-maquina',
        descricao: preventiva.descricao,
        intervaloDias: preventiva.intervaloDias,
        proximaData: preventiva.proximaData,
        ativa: preventiva.ativa,
      })),
    })
  }, [maquinaExistente, preventivasExistentes, reset])

  const nomeMaquina = useWatch({ control, name: 'nome' })

  const { mutateAsync: criar, isPending: criando } = useMutation({
    mutationFn: (dados: DadosCadastrarMaquina) =>
      servicoMaquinas.criar(dados, foto ?? undefined),
  })

  const { mutateAsync: atualizar, isPending: atualizando } = useMutation({
    mutationFn: (dados: DadosCadastrarMaquina) =>
      servicoMaquinas.atualizar({ id: id as string, ...dados }, foto ?? undefined),
  })

  async function aoEnviar(dados: DadosCadastrarMaquina) {
    if (emEdicao) {
      await atualizar(dados)
      toast.success('Máquina atualizada com sucesso.')
    } else {
      await criar(dados)
      toast.success('Máquina cadastrada com sucesso.')
    }

    reset(VALORES_PADRAO)
    setFoto(null)
    navegar(-1)
  }

  const isPending = criando || atualizando

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoSubpagina
        contexto="Painel do Administrador"
        titulo={emEdicao ? 'Editar Máquina' : 'Cadastrar Máquina'}
        Icone={PackagePlus}
      />

      <main className="flex flex-1 justify-center px-4 py-8">
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <form
            onSubmit={handleSubmit(aoEnviar)}
            noValidate
            className="flex flex-col gap-5 p-6 sm:p-8"
          >
            <UploadFoto foto={foto} aoSelecionarFoto={setFoto} />

            <div className="grid gap-5 sm:grid-cols-2">
              <CampoTexto
                rotulo="Tag *"
                variante="claro"
                placeholder="Ex: USI-PAST-LEITE"
                mensagemErro={errors.tag?.message}
                {...register('tag')}
              />
              <CampoTexto
                rotulo="Nome *"
                variante="claro"
                placeholder="Ex: Pasteurizador 33"
                mensagemErro={errors.nome?.message}
                {...register('nome')}
              />
            </div>

            <CampoTextoArea
              rotulo="Descrição"
              rows={3}
              placeholder="Descreva brevemente a máquina e sua função..."
              mensagemErro={errors.descricao?.message}
              {...register('descricao')}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <CampoTexto
                rotulo="Marca"
                variante="claro"
                placeholder="Ex: Arsopi"
                mensagemErro={errors.marca?.message}
                {...register('marca')}
              />
              <CampoTexto
                rotulo="Modelo"
                variante="claro"
                placeholder="Ex: X200-CNC"
                mensagemErro={errors.modelo?.message}
                {...register('modelo')}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <CampoSelecao
                rotulo="Criticidade *"
                mensagemErro={errors.criticidade?.message}
                {...register('criticidade')}
              >
                <option value="">Selecionar...</option>
                {niveisCriticidade.map((nivel) => (
                  <option key={nivel} value={nivel}>
                    {nivel}
                  </option>
                ))}
              </CampoSelecao>

              <CampoSelecao
                rotulo="Setor *"
                mensagemErro={errors.setor?.message}
                {...register('setor')}
              >
                <option value="">Selecionar...</option>
                {setoresDisponiveis.map((setor) => (
                  <option key={setor} value={setor}>
                    {setor}
                  </option>
                ))}
              </CampoSelecao>

              <CampoSelecao
                rotulo="Loja *"
                mensagemErro={errors.lojaId?.message}
                {...register('lojaId')}
              >
                <option value="">Selecionar...</option>
                {LOJAS_MOCK.map((loja) => (
                  <option key={loja.id} value={loja.id}>
                    {loja.nome}
                  </option>
                ))}
              </CampoSelecao>
            </div>

            <CampoPreventivas
              control={control}
              errors={errors}
              nomeMaquina={nomeMaquina}
            />

            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
              <div className="flex-1">
                <Botao type="button" variante="secundario" onClick={() => navegar(-1)}>
                  Cancelar
                </Botao>
              </div>
              <div className="flex-1">
                <Botao
                  type="submit"
                  disabled={isPending}
                  className="flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  {isPending ? 'Salvando...' : emEdicao ? 'Salvar Alterações' : 'Cadastrar'}
                </Botao>
              </div>
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
