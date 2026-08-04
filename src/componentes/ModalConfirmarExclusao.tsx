import { createPortal } from 'react-dom'
import { AlertTriangle, Trash2, XCircle } from 'lucide-react'
import { Botao } from './Botao'

interface ModalConfirmarExclusaoProps {
  titulo: string
  mensagem: string
  aoConfirmar: () => void
  aoFechar: () => void
  confirmando?: boolean
}

export function ModalConfirmarExclusao({
  titulo,
  mensagem,
  aoConfirmar,
  aoFechar,
  confirmando = false,
}: ModalConfirmarExclusaoProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-white" size={20} />
            <p className="text-lg font-bold text-white">{titulo}</p>
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

        <div className="flex flex-col gap-5 p-6">
          <p className="text-sm text-slate-600">{mensagem}</p>

          <div className="flex gap-3">
            <div className="flex-1">
              <Botao type="button" variante="secundario" onClick={aoFechar}>
                Cancelar
              </Botao>
            </div>
            <div className="flex-1">
              <Botao
                type="button"
                disabled={confirmando}
                onClick={aoConfirmar}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600"
              >
                <Trash2 size={16} />
                {confirmando ? 'Excluindo...' : 'Excluir'}
              </Botao>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
