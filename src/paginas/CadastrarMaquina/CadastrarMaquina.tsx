import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle2, PackagePlus } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Botao } from '../../componentes/Botao'
import { CampoTexto } from '../../componentes/CampoTexto'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { CampoTextoArea } from '../../componentes/CampoTextoArea'
import { CabecalhoPainelGestor } from '../../componentes/CabecalhoPainelSolicitante'
import { servicoMaquinas } from '../../servicos/servicoMaquinas'
import { LOJAS_MOCK } from '../../servicos/dadosMockLojas'
import { useEstadoAutenticacao } from '../../estado/estadoAutenticacao'
import { obterLojasIdsPermitidas } from '../../utilitarios/acessoGestor'
import { niveisCriticidade, setoresDisponiveis } from '../../tipos/maquina'
import {
  esquemaCadastrarMaquina,
  type DadosCadastrarMaquina,
} from './esquemaCadastrarMaquina'
import { UploadFoto } from './componentes/UploadFoto'
import { CampoPreventivas } from './componentes/CampoPreventivas'

export function CadastrarMaquina() {
  const navegar = useNavigate()
  const [foto, setFoto] = useState<File | null>(null)
  const escoposGestor = useEstadoAutenticacao((estado) => estado.escoposGestor)

  const lojasPermitidas = escoposGestor
    ? LOJAS_MOCK.filter((loja) =>
        obterLojasIdsPermitidas(escoposGestor).includes(loja.id),
      )
    : LOJAS_MOCK

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DadosCadastrarMaquina>({
    resolver: zodResolver(esquemaCadastrarMaquina),
    defaultValues: {
      tag: '',
      nome: '',
      descricao: '',
      marca: '',
      modelo: '',
      criticidade: undefined,
      setor: undefined,
      lojaId: '',
      preventivas: [],
    },
  })

  const nomeMaquina = useWatch({ control, name: 'nome' })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (dados: DadosCadastrarMaquina) =>
      servicoMaquinas.cadastrar(dados, foto ?? undefined),
  })

  async function aoEnviar(dados: DadosCadastrarMaquina) {
    await mutateAsync(dados)
    toast.success('Máquina cadastrada com sucesso.')
    reset()
    setFoto(null)
    navegar(-1)
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-600">
      <CabecalhoPainelGestor titulo="Cadastrar Máquina" Icone={PackagePlus} />

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
                {lojasPermitidas.map((loja) => (
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
                  {isPending ? 'Cadastrando...' : 'Cadastrar'}
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
