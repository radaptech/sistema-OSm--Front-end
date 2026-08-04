import { createPortal } from 'react-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Botao } from '../../../componentes/Botao'
import { CampoTexto } from '../../../componentes/CampoTexto'
import { CampoSelecao } from '../../../componentes/CampoSelecao'
import { SeletorMultiplo } from '../../../componentes/SeletorMultiplo'
import { LOJAS_MOCK } from '../../../servicos/dadosMockLojas'
import { areasTecnico } from '../../../tipos/tecnico'
import type { Tecnico } from '../../../tipos/tecnico'
import { esquemaEditarTecnico, type DadosEditarTecnico } from '../esquemaEditarTecnico'

const OPCOES_LOJAS = LOJAS_MOCK.map((loja) => ({ valor: loja.id, rotulo: loja.nome }))

interface ModalEditarTecnicoProps {
  tecnico: Tecnico
  aoFechar: () => void
  aoSalvar: (dados: DadosEditarTecnico) => void
}

export function ModalEditarTecnico({ tecnico, aoFechar, aoSalvar }: ModalEditarTecnicoProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<DadosEditarTecnico>({
    resolver: zodResolver(esquemaEditarTecnico),
    defaultValues: {
      nome: tecnico.nome,
      email: tecnico.email,
      telefone: tecnico.telefone ?? '',
      area: tecnico.area,
      lojasIds: tecnico.lojasIds,
      valorHora: tecnico.valorHora,
    },
  })

  const lojasIds = useWatch({ control, name: 'lojasIds' })

  function aoSalvarFormulario(dados: DadosEditarTecnico) {
    aoSalvar(dados)
    aoFechar()
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between bg-gradient-to-r from-[#1f4e2c] to-[#4bae70] px-6 py-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-white/80 uppercase">
              Painel do Administrador
            </p>
            <p className="text-lg font-bold text-white">Editar Técnico</p>
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
          className="flex max-h-[75vh] flex-col gap-5 overflow-y-auto p-6"
        >
          <CampoTexto
            rotulo="Nome *"
            variante="claro"
            mensagemErro={errors.nome?.message}
            {...register('nome')}
          />

          <div className="grid grid-cols-2 gap-4">
            <CampoTexto
              rotulo="E-mail *"
              variante="claro"
              type="email"
              mensagemErro={errors.email?.message}
              {...register('email')}
            />
            <CampoTexto
              rotulo="Telefone"
              variante="claro"
              mensagemErro={errors.telefone?.message}
              {...register('telefone')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CampoSelecao
              rotulo="Área de Atuação *"
              mensagemErro={errors.area?.message}
              {...register('area')}
            >
              {areasTecnico.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </CampoSelecao>

            <CampoTexto
              rotulo="Valor/Hora (R$) *"
              variante="claro"
              type="number"
              min={0}
              step="0.01"
              mensagemErro={errors.valorHora?.message}
              {...register('valorHora', { valueAsNumber: true })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold tracking-wide text-[#4bae70] uppercase">
              Loja(s) *
            </span>
            <SeletorMultiplo
              opcoes={OPCOES_LOJAS}
              selecionados={lojasIds}
              aoAlterar={(lojas) => setValue('lojasIds', lojas, { shouldValidate: true })}
            />
            {errors.lojasIds && (
              <span className="text-xs text-red-500">{errors.lojasIds.message}</span>
            )}
          </div>

          <div className="mt-1 flex gap-3">
            <div className="flex-1">
              <Botao type="button" variante="secundario" onClick={aoFechar}>
                Cancelar
              </Botao>
            </div>
            <div className="flex-1">
              <Botao type="submit" className="flex items-center justify-center gap-2">
                <CheckCircle2 size={16} />
                Salvar
              </Botao>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
