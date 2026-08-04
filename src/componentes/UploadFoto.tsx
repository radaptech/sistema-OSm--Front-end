import { Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, type ChangeEvent } from 'react'
import { toast } from 'react-toastify'

interface UploadFotoProps {
  foto: File | null
  aoSelecionarFoto: (arquivo: File | null) => void
  rotulo?: string
  textoAlternativo?: string
}

export function UploadFoto({
  foto,
  aoSelecionarFoto,
  rotulo = 'Foto da Máquina',
  textoAlternativo = 'Pré-visualização da máquina',
}: UploadFotoProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrl = useMemo(() => (foto ? URL.createObjectURL(foto) : null), [foto])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function aoMudarArquivo(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0]
    evento.target.value = ''

    if (!arquivo) {
      return
    }

    if (!arquivo.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem válido.')
      return
    }

    aoSelecionarFoto(arquivo)
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-wide text-[#4bae70] uppercase">
        {rotulo}
      </label>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/40 transition hover:bg-emerald-50 sm:h-48"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={textoAlternativo}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <span className="flex flex-col items-center gap-2 text-slate-500">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-300 text-emerald-500">
              <Plus size={20} />
            </span>
            <span className="text-sm">Clique para selecionar uma foto</span>
          </span>
        )}
      </button>

      {foto && (
        <button
          type="button"
          onClick={() => aoSelecionarFoto(null)}
          className="self-start text-xs font-medium text-red-500 hover:underline"
        >
          Remover foto
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={aoMudarArquivo}
      />
    </div>
  )
}
