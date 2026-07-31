import { createPortal } from 'react-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Botao } from '../../componentes/Botao'
import { CampoTexto } from '../../componentes/CampoTexto'
import { CampoSelecao } from '../../componentes/CampoSelecao'
import { CampoTextoArea } from '../../componentes/CampoTextoArea'
import { Alternador } from '../../componentes/Alternador'
import { useMaquinas } from '../../hooks/useMaquinas'
import type { PreventivaManutencao } from '../../tipos/maquina'
import {
  esquemaManutencaoPreventiva,
  type DadosManutencaoPreventiva,
} from './esquemaManutencaoPreventiva'

interface ModalManutencaoPreventivaProps {
  aoFechar: () => void
  aoSalvar: (preventiva: PreventivaManutencao) => void
  maquinaFixa?: { id: string; nome: string }
}

export function ModalManutencaoPreventiva({
  aoFechar,
  aoSalvar,
  maquinaFixa,
}: ModalManutencaoPreventivaProps) {
  const { data: maquinas = [] } = useMaquinas({ habilitado: !maquinaFixa })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DadosManutencaoPreventiva>({
    resolver: zodResolver(esquemaManutencaoPreventiva),
    defaultValues: {
      maquinaId: maquinaFixa?.id ?? '',
      descricao: '',
      intervaloDias: undefined,
      proximaData: '',
      ativa: true,
    },
  })

  function aoSalvarFormulario(dados: DadosManutencaoPreventiva) {
    aoSalvar(dados)
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
            <p className="text-lg font-bold text-white">Nova Manutenção Preventiva</p>
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
          <CampoSelecao
            rotulo="Máquina *"
            disabled={Boolean(maquinaFixa)}
            mensagemErro={errors.maquinaId?.message}
            {...register('maquinaId')}
          >
            {maquinaFixa ? (
              <option value={maquinaFixa.id}>{maquinaFixa.nome}</option>
            ) : (
              <>
                <option value="">Selecionar máquina...</option>
                {maquinas.map((maquina) => (
                  <option key={maquina.id} value={maquina.id}>
                    {maquina.nome}
                  </option>
                ))}
              </>
            )}
          </CampoSelecao>

          <CampoTextoArea
            rotulo="Descrição *"
            rows={3}
            placeholder="Descreva o procedimento de manutenção..."
            mensagemErro={errors.descricao?.message}
            {...register('descricao')}
          />

          <div className="grid grid-cols-2 gap-4">
            <CampoTexto
              rotulo="Intervalo (dias) *"
              variante="claro"
              type="number"
              min={1}
              placeholder="Ex: 30"
              mensagemErro={errors.intervaloDias?.message}
              {...register('intervaloDias', { valueAsNumber: true })}
            />
            <CampoTexto
              rotulo="Próxima Data *"
              variante="claro"
              type="date"
              mensagemErro={errors.proximaData?.message}
              {...register('proximaData')}
            />
          </div>

          <Controller
            control={control}
            name="ativa"
            render={({ field }) => (
              <Alternador
                id={field.name}
                rotulo="Ativa"
                descricao="Preventiva habilitada no sistema"
                marcado={field.value}
                aoAlternar={field.onChange}
              />
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
