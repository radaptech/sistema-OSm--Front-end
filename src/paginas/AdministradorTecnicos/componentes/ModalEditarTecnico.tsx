import { createPortal } from 'react-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Botao } from '../../../componentes/Botao'
import { CampoTexto } from '../../../componentes/CampoTexto'
import { CampoSelecao } from '../../../componentes/CampoSelecao'
import { SeletorMultiplo } from '../../../componentes/SeletorMultiplo'
import { useLojas } from '../../../hooks/useLojas'
import { areasTecnico } from '../../../tipos/tecnico'
import type { Tecnico } from '../../../tipos/tecnico'
import { esquemaEditarTecnico, type DadosEditarTecnico } from '../esquemaEditarTecnico'
import { useSaidaAnimada } from '../../../hooks/useSaidaAnimada'


interface ModalEditarTecnicoProps {
  tecnico: Tecnico
  aoFechar: () => void
  aoSalvar: (dados: DadosEditarTecnico) => void
}

export function ModalEditarTecnico({ tecnico, aoFechar, aoSalvar }: ModalEditarTecnicoProps) {
  const { fechar, classeFundo, classeCartao } = useSaidaAnimada(aoFechar)

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
    },
  })

  const lojasIds = useWatch({ control, name: 'lojasIds' })
  const { data: lojas = [] } = useLojas()
  const opcoesLojas = lojas.map((loja) => ({ valor: loja.id, rotulo: loja.nome }))

  function aoSalvarFormulario(dados: DadosEditarTecnico) {
    aoSalvar(dados)
    fechar()
  }

  return createPortal(
    <div className={`${classeFundo} fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm`}>
      <div className={`${classeCartao} w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-pop`}>
        <div className="flex items-start justify-between bg-gradient-to-r from-marca-900 to-marca-500 px-6 py-4">
          <div>
            <p className="font-mono text-xs font-bold tracking-widest text-white/80 uppercase">
              Painel do Administrador
            </p>
            <p className="font-display text-lg font-bold text-white">Editar Técnico</p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={fechar}
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

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs font-semibold tracking-wider text-marca-500 uppercase">
              Loja(s) *
            </span>
            <SeletorMultiplo
              opcoes={opcoesLojas}
              selecionados={lojasIds}
              aoAlterar={(lojas) => setValue('lojasIds', lojas, { shouldValidate: true })}
            />
            {errors.lojasIds && (
              <span className="text-xs text-red-500">{errors.lojasIds.message}</span>
            )}
          </div>

          <div className="mt-1 flex gap-3">
            <div className="flex-1">
              <Botao type="button" variante="secundario" onClick={fechar}>
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
