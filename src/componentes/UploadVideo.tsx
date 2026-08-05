import { Video } from 'lucide-react'
import { useEffect, useMemo, useRef, type ChangeEvent } from 'react'
import { toast } from 'react-toastify'

interface UploadVideoProps {
  video: File | null
  aoSelecionarVideo: (arquivo: File | null) => void
  rotulo?: string
}

export function UploadVideo({
  video,
  aoSelecionarVideo,
  rotulo = 'Vídeo do Defeito (opcional)',
}: UploadVideoProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrl = useMemo(() => (video ? URL.createObjectURL(video) : null), [video])

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

    if (!arquivo.type.startsWith('video/')) {
      toast.error('Selecione um arquivo de vídeo válido.')
      return
    }

    aoSelecionarVideo(arquivo)
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-wide text-[#4bae70] uppercase">
        {rotulo}
      </label>

      {previewUrl ? (
        <video
          src={previewUrl}
          controls
          className="h-40 w-full rounded-lg bg-black object-contain sm:h-48"
        />
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/40 transition hover:bg-emerald-50 sm:h-48"
        >
          <span className="flex flex-col items-center gap-2 text-slate-500">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-300 text-emerald-500">
              <Video size={20} />
            </span>
            <span className="text-sm">Clique para gravar/selecionar um vídeo</span>
          </span>
        </button>
      )}

      {video && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="self-start text-xs font-medium text-[#1f4e2c] hover:underline"
          >
            Trocar vídeo
          </button>
          <button
            type="button"
            onClick={() => aoSelecionarVideo(null)}
            className="self-start text-xs font-medium text-red-500 hover:underline"
          >
            Remover vídeo
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={aoMudarArquivo}
      />
    </div>
  )
}
