import { toast } from 'react-toastify'
import { simularFetch } from '../mocks/apiMock'

declare const process: { env: Record<string, string | undefined> }

// Modo alternável (ver CLAUDE.md): sem back-end disponível, VITE_USE_MOCKS troca o
// fetch real por src/mocks/apiMock.ts, mantendo intacta a lógica de erro/401/blob abaixo.
const USAR_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

const URL_HOMOLOGACAO = 'https://homolog-api.sistema-os.com.br'

const CHAVES_ERRO_BACKEND = ['error', 'erro', 'message', 'detalhes'] as const

type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface OpcoesRequisicao {
  metodo?: MetodoHttp
  corpo?: unknown
  cabecalhos?: Record<string, string>
}

type TipoConteudoResposta = 'json' | 'blob' | 'texto'

function obterUrlBase(): string {
  const urlConfigurada = process.env.REACT_APP_URL_API

  if (!urlConfigurada) {
    return URL_HOMOLOGACAO
  }

  return /^https?:\/\//i.test(urlConfigurada)
    ? urlConfigurada
    : `https://${urlConfigurada}`
}

function obterTenantId(): string {
  return window.location.hostname.split('.')[0]
}

function inferirTipoConteudoResposta(resposta: Response): TipoConteudoResposta {
  const contentType = resposta.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return 'json'
  }

  if (
    contentType.includes('application/pdf') ||
    contentType.includes('application/octet-stream') ||
    contentType.startsWith('image/')
  ) {
    return 'blob'
  }

  return 'texto'
}

function extrairMensagemErro(corpoResposta: unknown): string | null {
  if (!corpoResposta || typeof corpoResposta !== 'object') {
    return null
  }

  for (const chave of CHAVES_ERRO_BACKEND) {
    const valor = (corpoResposta as Record<string, unknown>)[chave]
    if (typeof valor === 'string' && valor.trim().length > 0) {
      return valor
    }
  }

  return null
}

function redirecionarParaLogin(): void {
  toast.error('Sua sessão expirou.')
  window.location.href = '/login'
}

async function lerCorpoResposta(
  resposta: Response,
): Promise<{ tipo: TipoConteudoResposta; dados: unknown }> {
  const tipo = inferirTipoConteudoResposta(resposta)

  if (tipo === 'json') {
    const dados = await resposta.json().catch(() => null)
    return { tipo, dados }
  }

  if (tipo === 'blob') {
    const dados = await resposta.blob()
    return { tipo, dados }
  }

  const dados = await resposta.text()
  return { tipo, dados }
}

async function requisitar<T = unknown>(
  endpoint: string,
  opcoes: OpcoesRequisicao = {},
): Promise<T> {
  const { metodo = 'GET', corpo, cabecalhos = {} } = opcoes
  const ehFormData = corpo instanceof FormData

  const cabecalhosFinais: Record<string, string> = {
    'X-tenant-ID': obterTenantId(),
    ...cabecalhos,
  }

  if (!ehFormData) {
    cabecalhosFinais['Content-Type'] = 'application/json'
  }

  let resposta: Response

  try {
    resposta = USAR_MOCKS
      ? await simularFetch(endpoint, metodo, corpo)
      : await fetch(`${obterUrlBase()}${endpoint}`, {
          method: metodo,
          credentials: 'include',
          headers: cabecalhosFinais,
          body:
            corpo === undefined
              ? undefined
              : ehFormData
                ? (corpo as FormData)
                : JSON.stringify(corpo),
        })
  } catch {
    const mensagem = 'Não foi possível conectar ao servidor. Verifique sua conexão.'
    toast.error(mensagem)
    throw new Error(mensagem)
  }

  const { dados } = await lerCorpoResposta(resposta)

  if (!resposta.ok) {
    const estaNaTelaLogin = window.location.pathname === '/login'

    if (resposta.status === 401 && !estaNaTelaLogin) {
      redirecionarParaLogin()
      throw new Error('Sessão expirada.')
    }

    const mensagemErro =
      extrairMensagemErro(dados) ?? 'Ocorreu um erro inesperado. Tente novamente.'
    toast.error(mensagemErro)
    throw new Error(mensagemErro)
  }

  return dados as T
}

export const api = {
  get: <T = unknown>(endpoint: string, cabecalhos?: Record<string, string>) =>
    requisitar<T>(endpoint, { metodo: 'GET', cabecalhos }),

  post: <T = unknown>(
    endpoint: string,
    corpo?: unknown,
    cabecalhos?: Record<string, string>,
  ) => requisitar<T>(endpoint, { metodo: 'POST', corpo, cabecalhos }),

  put: <T = unknown>(
    endpoint: string,
    corpo?: unknown,
    cabecalhos?: Record<string, string>,
  ) => requisitar<T>(endpoint, { metodo: 'PUT', corpo, cabecalhos }),

  patch: <T = unknown>(
    endpoint: string,
    corpo?: unknown,
    cabecalhos?: Record<string, string>,
  ) => requisitar<T>(endpoint, { metodo: 'PATCH', corpo, cabecalhos }),

  delete: <T = unknown>(endpoint: string, cabecalhos?: Record<string, string>) =>
    requisitar<T>(endpoint, { metodo: 'DELETE', cabecalhos }),
}
