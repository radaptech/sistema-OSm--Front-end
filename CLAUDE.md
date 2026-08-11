# Contexto do Projeto - Front-end (EPI SaaS / Solicitação OS)

## Regra de Autonomia Absoluta
- **Execução Direta:** Nunca peça confirmações óbvias, validações intermediárias ou permissões para prosseguir com o que foi solicitado. Se o comando foi dado, execute a tarefa por completo, gere o código necessário de ponta a ponta e apresente o resultado final de forma autônoma.

## Regra de Integração e Navegação Real
- **Aplicação Real, Integrada ao Back-end:** Nenhuma tela deve ser tratada como um componente isolado ou estático. Todas as telas DEVEM ser interligadas de verdade através do React Router DOM, permitindo a navegação completa de ponta a ponta (ex: clicar em "Minhas Solicitações" na Home direciona para a tela de listagem, clicar em "Nova OS" abre o formulário, etc.).
- **Sem dados mockados (REGRA ATUAL):** o front **não possui mais nenhum dado mockado, array em memória ou serviço fake**. Todos os `servico*.ts` conversam com a API real via `api.ts`. Não reintroduza mocks: se um endpoint ainda não existe no back-end, defina o contrato aqui e no serviço, e deixe a tela lidar com o estado de carregamento/erro.
- **Estado de Autenticação:** a sessão vem do servidor (cookie HttpOnly) e é espelhada num estado global leve (Zustand, `useEstadoAutenticacao`) apenas para leitura pelas telas — o front **não deriva** perfil, escopo de acesso, loja, setor ou `tecnicoId`; tudo isso chega pronto no payload de `/autenticacao/login` e `/autenticacao/sessao`.

## Tech Stack e Infraestrutura
- **Framework & Build:** React 19+ com TypeScript, empacotado via **Vite**.
- **Roteamento:** React Router DOM 7 (com implementação de Rotas Protegidas).
- **Estilização:** Tailwind CSS **v4** (plugin `@tailwindcss/vite`, com `@config '../tailwind.config.ts'` declarado em `index.css`). Mobile-First obrigatório.
- **Ícones:** Lucide React.
- **Gerenciamento de Formulários:** React Hook Form integrado com **Zod v4** para validação de esquemas.
- **Busca de Dados & Cache:** TanStack Query (React Query) para chamadas HTTP, cache de listas e painéis de indicadores (dashboards).
- **Gerenciamento de Estado Global:** Zustand — `estadoAutenticacao` (espelho da sessão) e `estadoModais` (Máquina de Modais).
- **Qualidade de Código (Linting & Formatting):** ESLint e Prettier (utilizando o plugin `prettier-plugin-tailwindcss` para ordenação automática das classes).
- **Cliente HTTP:** Wrapper customizado nativo (Fetch API), substituindo bibliotecas de terceiros como Axios.
- **Notificações/Alertas:** React-Toastify (Para feedback global de erros, sucesso e avisos).

## Identidade Visual (Design Tokens)
Definidos em `tailwind.config.ts` e usados em toda a aplicação — não hardcode cores/hex nas telas.
- **Paleta `marca`:** `marca-950` `#0f2916` → `marca-100` `#e4f6e9`. Cabeçalhos e botões primários usam o gradiente `from-marca-900 to-marca-500`.
- **Fontes:** `font-display` (Big Shoulders — títulos), `font-sans` (IBM Plex Sans — corpo, padrão no `body`), `font-mono` (IBM Plex Mono — rótulos em caixa alta, códigos, e-mails, rodapés).
- **Sombras:** `shadow-card`, `shadow-card-hover` (cards e listagens), `shadow-pop` (modais).
- **Textura:** `bg-grade-industrial` + `bg-grade` (grade sutil sobre gradientes de cabeçalho/login).
- **Animações:** `animate-fade-in` (overlay de modal) e `animate-pop-in` (card do modal, card do login).
- **Acessibilidade global (`index.css`):** anel de foco `:focus-visible` verde consistente, scrollbar temática e `@media (prefers-reduced-motion: reduce)` desligando animações.

## Estrutura de Pastas e Organização do Código
A arquitetura do projeto deve seguir uma separação clara de responsabilidades e **adotar estritamente a nomenclatura em Português-BR**:
- **Idioma do Código (Português-BR):** Nomenclaturas de pastas, componentes, funções, variáveis e arquivos devem ser em Português (ex: `Botao` em vez de `Button`, `formatarData` em vez de `formatDate`). Apenas prefixos/termos nativos do React (como `use` para hooks) devem ser mantidos.
- **Modularização e Limite de Tamanho (REGRA DE OURO):** Evite arquivos gigantes. Se um arquivo começar a ficar muito extenso e complexo, ele **DEVE** ser dividido em partes menores (criação de subcomponentes, divisão lógica de arquivos ou extração de regras de negócio para hooks/utilitários independentes).
- **`/src/componentes`**: Componentes visuais isolados e reaproveitáveis (ex: `Botao`, `CampoTexto`, `Paginacao`). Devem ser "burros" (receber apenas props) sempre que possível.
- **`/src/paginas`**: Telas completas da aplicação (ex: `PainelGestor.tsx`, `TelaLogin.tsx`). Montagem de layout e consumo de hooks/queries. Se a página for complexa, crie uma subpasta para ela com seus componentes locais (ex: `/src/paginas/PainelGestor/componentes/`) e seus esquemas Zod (ex: `esquemaAprovarOSTerceiros.ts`).
- **`/src/servicos`**: Cliente HTTP (`api.ts`), helpers de requisição (`montarQuery.ts`, `montarMultipart.ts`) e a abstração de endpoints por domínio (`servicoMaquinas.ts`, `servicoOrdensServico.ts`, …). **Nenhum serviço guarda estado** — são funções finas sobre `api.ts`.
- **`/src/hooks`**: Ganchos customizados, quase todos wrappers de `useQuery` (`useMaquinas.ts`, `useSessao.ts`, …). As mutações (`useMutation`) ficam nas próprias páginas, junto do `invalidateQueries` correspondente.
- **`/src/estado`**: Estados globais (Zustand): `estadoAutenticacao` e `estadoModais`.
- **`/src/utilitarios`**: Funções puras (`formatarData.ts`, `formatarMoeda.ts`, `dataBackend.ts`, `calcularHoras.ts`, `acessoGestor.ts`, `alvoOS.ts`, …).
- **`/src/rotas`**: Configuração do roteamento, separando rotas públicas (`RotaPublica`) das rotas protegidas por perfil (`RotaProtegida`).
- **`/src/tipos`**: Tipagens estritas do TypeScript, espelhando o contrato da API e o banco PostgreSQL.

## Autenticação, Segurança e Regras de Negócio (IMPORTANTE)
- **Arquitetura Multi-Locatário (Multi-Tenant) Baseada em Subdomínio:** O sistema atende a múltiplos clientes. O `tenantId` é extraído dinamicamente do subdomínio da URL atual (`window.location.hostname.split(".")[0]`) e injetado em todas as requisições via header estrito `X-tenant-ID`.
- **Gerenciamento de Sessão via Cookies:** O token JWT retornado pelo back-end é gerenciado via **Cookies HttpOnly**. É terminantemente proibido armazenar o JWT em `localStorage` ou variáveis globais. O cliente HTTP usa `credentials: "include"`.
- **Restauração de Sessão no Bootstrap (`PortaoSessao`):** `App.tsx` envolve as rotas no `PortaoSessao` (`/src/componentes/PortaoSessao.tsx`), que chama `useSessao` (`GET /autenticacao/sessao`) antes de renderizar qualquer rota e exibe `CarregandoSessao` enquanto isso. Sem esse passo, recarregar a página derrubaria o usuário mesmo com o cookie ainda válido no servidor. O endpoint responde **401 quando não há sessão** — o que não é erro, é só "não logado" — por isso `useSessao` usa `retry: false` e `staleTime: Infinity`.
- **Tratamento Global de Erros (401 Não Autorizado):** Se a API retornar 401 e a rota atual não for `/login`, o `api.ts` dispara um toast ("Sua sessão expirou.") e redireciona forçosamente para o Login.
- **Hierarquia Organizacional (Tenant > Empresa > Loja > Setor):** cada tenant possui uma ou mais **Empresas** (`Empresa`, `/src/tipos/empresa.ts` — só `id`/`nome`, listada por `GET /empresas` e usada como vínculo obrigatório da Loja em `CadastrarLoja`); cada Empresa possui **Lojas** (unidades/filiais, com `empresaId`); cada Loja possui seus **Setores**. Máquinas e Ordens de Serviço pertencem sempre a uma Loja + Setor (`lojaId` + `setor`).
- **Controle de Acesso por Loja e Setor (Gestor):** o acesso do Gestor é definido por uma lista de **escopos** (`EscopoAcessoGestor[]`, `/src/tipos/autenticacao.ts`), onde cada escopo vincula uma Loja a um conjunto de setores:
  - **Restrito a setores específicos** dentro de uma Loja (`setoresIds: number[]`) — ex: Gestor que responde apenas por "Padaria" e "Açougue" da Loja 1, enquanto outro Gestor da mesma loja responde por "Hortifruti" e "Peixaria".
  - **Total sobre uma Loja inteira** (`setoresIds: 'todos'`) — ex: Gestor que responde por todos os setores das Lojas 2 e 3 simultaneamente (um Gestor pode ter múltiplos escopos).
  **O filtro real é do servidor:** as listagens do Gestor (`/solicitacoes`, `/ordens-servico`, `/preventivas`) já voltam restritas ao escopo do usuário autenticado. Os escopos que chegam na sessão são usados no front apenas para **organização visual** — `agruparPorEscopoGestor` (`/src/utilitarios/acessoGestor.ts`) monta os blocos por Loja e, dentro dela, por Setor. `gestorTemAcesso`/`filtrarPorAcessoGestor`/`obterLojasIdsPermitidas` continuam disponíveis no mesmo arquivo, mas nunca como única barreira de acesso.
- **Controle de Acesso por Setor (Solicitante):** o Solicitante está vinculado a exatamente uma Loja + um Setor (`lojaId`/`setor` na sessão). Ao abrir uma Nova Solicitação OS, ele só vê **máquinas do seu próprio setor** — o front repassa `useMaquinas({ setor, lojaId })` e o servidor aplica a restrição.
- **Máquina exige Manutenção Preventiva (REGRA DE NEGÓCIO):** uma Máquina só pode ser cadastrada (ou salva em edição) se tiver **uma ou mais Manutenções Preventivas** no mesmo formulário — envio bloqueado sem isso, validado via Zod (`esquemaCadastrarMaquina`, `preventivas` com `min(1)`) e enviado na mesma requisição (ver item 5).
- **Acesso Total do Administrador (4º perfil):** o Administrador tem acesso irrestrito a **todo o tenant**, sem escopo por Loja/Setor (`lojaId`, `setor`, `escoposGestor` e `tecnicoId` chegam nulos na sessão). É o perfil responsável por **todos os cadastros do sistema** (Usuários, Lojas, Setores, Técnicos, Máquinas e Empresas Terceirizadas), com CRUD completo em cada um — ver item 12.
- **Rotas Protegidas por Perfil:** `RotaProtegida` (`/src/rotas/RotaProtegida.tsx`) aceita `perfis?: PerfilLogin[]`. Sem autenticação, redireciona para `/login`; autenticado mas com perfil fora da lista, redireciona para a rota inicial do próprio perfil (`ROTA_POR_PERFIL[perfil]`). Em `RotasPrincipais.tsx`: Solicitante (`/home-solicitante`, `/nova-solicitacao-os`, `/nova-solicitacao-reparo`, `/nova-solicitacao-os-terceiros`, `/minhas-solicitacoes`) usa `perfis={['solicitante']}`; `/painel-tecnico` usa `perfis={['tecnico']}`; `/painel-gestor` e `/dashboard-gestor` usam `perfis={['gestor']}`; e todo o grupo do Administrador (`/painel-administrador`, `/administrador/*`, além das telas de cadastro `/cadastrar-usuario`, `/cadastrar-loja`, `/cadastrar-setor`, `/cadastrar-maquina`, `/cadastrar-empresa-terceirizada` — cada uma com uma rota irmã `/:id` para edição) usa `perfis={['administrador']}`. `RotaPublica` protege `/login` no sentido inverso (quem já está logado é mandado para o seu painel).

## Configuração Base de API (`api.ts`) & Variáveis de Ambiente
Todo o tráfego HTTP passa por um wrapper nativo (`fetch`) padronizado — **não existe nenhum caminho alternativo**.
- **Variáveis de Ambiente:** `.env.example` na raiz documenta `REACT_APP_URL_API`. O `api.ts` lê `process.env.REACT_APP_URL_API` com fallback para a URL de homologação e prefixa `https://` caso o protocolo seja omitido.
- **Cabeçalhos Automáticos:** injeta `X-tenant-ID` sempre e `Content-Type: application/json` **exceto** quando o corpo for `FormData` (o navegador precisa definir o `boundary` sozinho).
- **Resolução de Resposta:** lê JSON, texto ou binário/Blob conforme o `content-type` (`application/pdf`, `application/octet-stream`, `image/*` viram `Blob` — usado na impressão de OS).
- **Integração de Alertas:** captura as chaves de erro do backend (`error`, `erro`, `message`, `detalhes`) e exibe o toast automaticamente; falha de rede vira "Não foi possível conectar ao servidor.".
- **Métodos:** `api.get/post/put/patch/delete`, todos genéricos em `<T>`.
- **React Query (`App.tsx`):** `retry: 1` e `refetchOnWindowFocus: false` — o `api.ts` já trata 401 globalmente, repetir a requisição só atrasaria o redirecionamento.

## Contrato com o Back-end
Regras transversais que valem para **todos** os serviços. Ao criar um endpoint novo, siga estas convenções em vez de inventar outra.

- **Query string (`montarQuery.ts`):** monta `?a=1&b=2` descartando `undefined`/`null`/`''` (evita `?lojaId=undefined`). Arrays viram lista separada por vírgula (ex: `status=Aberta,Pausada`).
- **Upload (`montarMultipart.ts`):** endpoints com arquivo recebem `multipart/form-data` com a parte **`dados`** carregando o JSON e as demais partes carregando os arquivos (`foto`, `video`). Usado em `POST/PUT /maquinas` e nas três criações de solicitação.
- **Formato de data/hora (`dataBackend.ts`) — REGRA CRÍTICA:** o back-end troca datas como **`dd/mm/yyyy HH:MM:SS`** (ou `dd/mm/yyyy` sem hora). **Nunca** use `new Date(textoDaApi)` direto: o parser nativo não entende `dd/mm/yyyy` e interpreta `08/09/2026` como 8 de setembro num ambiente e 9 de agosto em outro. Use `converterDataBackend`, `formatarDataHoraBackend`, `agoraParaBackend`, `ehDataBackendValida` e — para `<input type="date">`, que trabalha em `YYYY-MM-DD` — `converterDataFormularioParaBackend` / `converterDataBackendParaFormulario`.
- **Paginação (`RespostaPaginada<T>`, `/src/tipos/paginacao.ts`):** `{ dados, pagina, totalPaginas, total }`. Usada nos endpoints paginados **no servidor** (`GET /usuarios`, `GET /solicitacoes/minhas`). Os demais endpoints devolvem array simples e a tela pagina client-side com o componente `Paginacao` (10 por página) — ver item 12.
- **O servidor é a fonte da verdade dos fatos:** instante de criação/abertura/encerramento, autoria (`solicitanteId`, `lancadoPorNome`, `encerradoPorNome`), horas calculadas (`horasTrabalhadas`/`horasParada`), escopo de acesso e a flag `finalizada` são **derivados no servidor**. O front nunca envia esses campos; quando exibe um "Data/Hora" antes de salvar, é apenas confirmação visual do instante local.
- **Endpoints por domínio:**
  - `servicoAutenticacao` → `POST /autenticacao/login`, `GET /autenticacao/sessao`, `POST /autenticacao/logout`
  - `servicoEmpresas` → `GET /empresas`
  - `servicoLojas` → CRUD em `/lojas`
  - `servicoSetores` → CRUD em `/setores` (`?lojaId=`)
  - `servicoUsuarios` → CRUD em `/usuarios` (`?perfil=&lojaId=&busca=&pagina=`) — **superfície única de escrita dos 4 perfis, inclusive Técnico**
  - `servicoTecnicos` → `GET /tecnicos` (`?lojaId=`) e `GET /tecnicos/:id` — **somente leitura**
  - `servicoMaquinas` → CRUD em `/maquinas` (`?setor=&lojaId=`), com foto + preventivas via multipart
  - `servicoPreventivas` → CRUD em `/preventivas` (`?maquinaId=`)
  - `servicoEmpresasTerceirizadas` → CRUD em `/empresas-terceirizadas`
  - `servicoSolicitacoes` → `POST /solicitacoes/maquinario`, `GET /solicitacoes/minhas`, `GET /solicitacoes`, `GET /solicitacoes/:id`, `GET /solicitacoes/resumo`, `POST /solicitacoes/:id/abrir-os`, `POST /solicitacoes/:id/aprovar-terceiros`, `POST /solicitacoes/:id/rejeitar`
  - `servicoReparos` → `POST /solicitacoes/reparo`
  - `servicoOSTerceiros` → `POST /solicitacoes/terceiros`
  - `servicoOrdensServico` → `GET /ordens-servico` (`?status=&finalizada=&tipo=&lojaId=&tecnicoId=&busca=&pagina=`), `GET /ordens-servico/:id`, `POST /ordens-servico/:id/iniciar|pausar|retomar|encerrar|custo`, `GET /ordens-servico/:id/impressao` (Blob/PDF)
  - `servicoIndicadores` → `GET /indicadores/maquinas/:maquinaId`

## Especificações de Telas

### 1. Tela de Login (`TelaLogin`)
- **Fundo Global:** gradiente `from-marca-950 via-marca-800 to-marca-500` com a textura `bg-grade-industrial` e halos desfocados.
- **Card Central:** fundo branco, cantos arredondados (`rounded-2xl`), padding generoso, largura fixa elegante (`max-w-md`), `shadow-pop` e entrada `animate-pop-in`.
- **Cabeçalho do Card:** ícone `Wrench` num quadrado com gradiente da marca, título "Solicitação OS" em `font-display`, subtítulo "LOGIN DE ACESSO" em `font-mono`, caixa alta, `text-xs`, `text-marca-500`.
- **Labels dos Campos:** "PERFIL", "LOGIN", "SENHA DE ACESSO" em `font-mono`, caixa alta, `text-xs`, `text-marca-500`.
- **Seletor de Perfil (Tabs):** `SeletorPerfil` compartilhado com `CadastrarUsuario` (item 7), 4 abas com ícones Lucide (`User` Solicitante, `Wrench` Técnico, `ShieldCheck` Gestor, `UserCog` Administrador). Aba ativa com fundo verde escuro e texto branco; inativas transparentes. **Layout fixo em grade 2×2 (`grid grid-cols-2`), não por breakpoint de viewport:** o seletor sempre vive dentro de um card estreito (`max-w-md`), então o espaço disponível não cresce com a tela — uma tentativa anterior de virar linha única a partir de `sm` (`sm:flex`) cortava o texto das abas em monitores largos, porque `sm` reage à largura da *viewport*, não à do *card* (~448px sempre). A grade 2×2 resolve em qualquer tamanho.
- **Campos de Input:** variante `claro` do `CampoTexto` (fundo esverdeado bem claro, sem borda forte, `rounded-lg`, texto verde escuro). Ícone de visibilidade da senha em verde.
- **Link Auxiliar:** "Esqueci minha senha" à direita, fonte pequena, verde.
- **Botão Principal:** "Entrar" com gradiente sólido da marca, texto branco, cantos arredondados.
- **Rodapé do Card:** "SOLICITAÇÃO OS © {ano}" centralizado, `font-mono`, muito pequeno.
- **Ao enviar:** `servicoAutenticacao.entrar` devolve a `SessaoUsuario` completa (perfil, `lojaId`/`setor`, `escoposGestor`, `tecnicoId`); o front guarda com `entrar(sessao)` e navega para `ROTA_POR_PERFIL[sessao.perfil]`. **O front não deriva escopo de acesso a partir do perfil escolhido na tela.**

### 2. Tela Principal do Solicitante (`HomeSolicitante`)
- **Fundo Global:** cinza sólido uniforme (`bg-slate-600`), estruturado de ponta a ponta (header verde, conteúdo centralizado, footer discreto).
- **Header Superior (`CabecalhoTopo`):** faixa em gradiente da marca. À esquerda, "SOLICITAÇÃO OS" e a saudação "Olá, `nome do usuário logado`". À direita, ícones de Notificações (sino) e Sair (logout — chama `servicoAutenticacao.sair` e limpa o estado).
- **Área Central:** título "O que deseja fazer?" com subtítulo descritivo.
- **Cards de Ação (Esquema de Cores Obrigatório):**
  - Cards de navegação centralizados em largura moderada (`CardAcao`, `/src/componentes/CardAcao.tsx`).
  - "Minhas Solicitações" — `variante: 'padrao'`, cinza escuro secundário (`bg-slate-700`).
  - "Nova Solicitação OS Maquinário" — `variante: 'destaque'`, verde sólido, ícone `CirclePlus` (item 3).
  - "Nova Solicitação OS Pequenos Reparos" — `variante: 'reparo'`, laranja (`bg-orange-600`, ícone `Hammer`), diferenciando-se do Maquinário sem reaproveitar o âmbar usado como cor de alerta/pendência (item 3b).
  - "Nova Solicitação OS Terceiros" — `variante: 'terceiros'`, azul (`bg-blue-600`, ícone `Truck`), reforçando o caráter "externo/parceiro" (item 3c).
- **Cards de Estatísticas (Grid Inferior):** três blocos com os contadores `Abertas`, `Em andamento`, `Concluídas`, vindos de `useResumoSolicitacoes` (`GET /solicitacoes/resumo`, tipo `ResumoSolicitacoes`) — contagem feita no servidor, não somando listas no cliente.
- **Rodapé:** "SOLICITAÇÃO OS © {ano}" discreto e centralizado.

### 3. Tela de Nova Solicitação OS Maquinário (`NovaSolicitacaoOS`)
- **Formulário (Zod + React Hook Form):**
  - **Máquina \***: select atrelado a uma pré-visualização de foto (`PreviaMaquina`, `object-contain`), restrito às máquinas do setor/loja do solicitante (`useMaquinas({ setor, lojaId })`).
  - **Tipo de Defeito \***: seleção fixa (`Mecânico`, `Elétrico`, `Hidráulico`, `Pneumático`, `Software / CNC`, `Estrutural` — `tiposDefeito`).
  - **Setor / Solicitante:** somente leitura, derivados da máquina selecionada e da sessão. **Não são enviados** — o servidor os deriva.
  - **Data/Hora:** somente leitura, capturada uma única vez na abertura da tela (`useState(() => agoraParaBackend())`). É **confirmação visual**; o instante gravado é o do servidor e não faz parte do payload.
  - **Descrição \***: `textarea` com limite de 1000 caracteres e contador.
  - **Foto do Defeito \* (REGRA DE NEGÓCIO):** obrigatória — `UploadFoto` (`/src/componentes/UploadFoto.tsx`, `capture="environment"` para abrir a câmera nativa no celular). Diferente da pré-visualização da Máquina (foto de cadastro), é uma foto nova mostrando o defeito. Controlada fora do React Hook Form (`useState<File | null>`) e validada no `aoEnviar` — sem ela, o envio é bloqueado com toast de erro.
  - **Vídeo do Defeito (opcional):** `UploadVideo` (`/src/componentes/UploadVideo.tsx`, espelha o `UploadFoto` com preview `<video controls>`). Útil quando o defeito só se entende em movimento (ruído, vazamento, vibração).
  - **Marcadores de Impacto:** checkboxes preenchidos pelo próprio Solicitante (`Afeta Produção`, `Parada Parcial`, `Retrabalho` — `marcadoresImpacto`), enviados em `impactos` e exibidos ao Gestor no `ModalDetalhesSolicitacao` (item 6).
- **Ação:** Enviar Solicitação → `servicoSolicitacoes.criar(dados, fotoDefeito, videoDefeito?)` → `POST /solicitacoes/maquinario` em multipart. O payload (`NovaSolicitacaoOSPayload`) tem só `maquinaId`, `tipoDefeito`, `descricao` e `impactos`.

### 3b. Tela de Nova Solicitação OS Pequenos Reparos (`NovaSolicitacaoReparo`)
- **Acesso:** card "Nova Solicitação OS Pequenos Reparos" na `HomeSolicitante`, rota `/nova-solicitacao-reparo`, mesmo grupo protegido (`perfis={['solicitante']}`).
- **Propósito:** reparos pontuais que **não exigem cadastro prévio de um item** — lâmpada queimada, vidro quebrado, piso rachado. Diferente do item 3, não há seleção de `Máquina`: o Solicitante descreve o item na hora.
- **Cabeçalho colorido em laranja** (`bg-gradient-to-r from-orange-500 to-orange-600`), reforçando a diferenciação do card na Home.
- **Campos (Zod):**
  - **Foto do Item:** `UploadFoto` (mesmo componente do item 3, com `rotulo`/`textoAlternativo` customizados por contexto).
  - **Item \***: texto livre (ex: "Lâmpada de LED") — vai em `itemDescricao`, não é select.
  - **Solicitante / Setor:** somente leitura, derivados da sessão (não dependem de máquina selecionada) e não enviados.
  - **Data/Hora:** somente leitura, mesmo padrão do item 3.
  - **Descrição \***: `textarea` com limite de caracteres.
- **Serviço:** `servicoReparos.criar` → `POST /solicitacoes/reparo` (multipart, `NovaSolicitacaoReparoPayload` em `/src/tipos/reparo.ts`). A solicitação criada volta com `tipo: 'reparo'`, `maquinaId`/`maquinaNome`/`maquinaCodigo` nulos e o texto livre em `itemDescricao`.
- **Integrado ao pipeline de aprovação (REGRA DE NEGÓCIO):** segue o **mesmo fluxo da OS de Maquinário** — aparece na aba `Solicitações` do Gestor (item 6), recebe Técnico via `ModalAbrirOrdemServico` (item 10), passa por `Aberta`/`Em Andamento`/`Pausada`/`Concluída` no Painel do Técnico (item 9) e só vira "Finalizada" com o custo lançado (item 12/13).

### 3c. Tela de Nova Solicitação OS Terceiros (`NovaSolicitacaoOSTerceiros`)
- **Acesso:** card "Nova Solicitação OS Terceiros" na `HomeSolicitante`, rota `/nova-solicitacao-os-terceiros`, mesmo grupo protegido das demais OS.
- **Propósito:** máquina cadastrada quebra e o reparo **não é feito pelos técnicos internos**, mas por empresa terceirizada especializada (assistência de balanças, refrigeração comercial). Diferente do item 3b, parte de uma `Máquina` cadastrada — mesma seleção com `PreviaMaquina` e mesmo filtro por setor/loja do Solicitante.
- **Cabeçalho colorido em azul** (`bg-gradient-to-r from-blue-500 to-blue-600`).
- **Campos (Zod):** **Máquina \***, **Tipo de Defeito \*** (mesma lista do item 3), **Solicitante** e **Setor da Máquina** (somente leitura, derivados), **Data/Hora** (somente leitura), **Descrição \***, **Foto do Defeito \*** e **Vídeo do Defeito (opcional)** — mesmos componentes e mesma regra do item 3 (foto obrigatória bloqueando o envio via toast).
- **Empresa Terceirizada NÃO é escolhida aqui (REGRA DE NEGÓCIO):** quem decide qual empresa vai atender é o **Gestor**, no momento da aprovação (item 6). O formulário só registra que a máquina precisa de atendimento terceirizado.
- **Serviço:** `servicoOSTerceiros.criar` → `POST /solicitacoes/terceiros` (multipart, `NovaSolicitacaoOSTerceirosPayload` em `/src/tipos/osTerceiros.ts`).
- **Integrado ao pipeline de aprovação (REGRA DE NEGÓCIO):** aparece na aba `Solicitações` do Gestor como as demais, mas o botão vira **"Aprovar"** em vez de "Abrir OS" — abre o `ModalAprovarOSTerceiros`. Diferente de Maquinário/Reparo, **não passa pelos estados do Técnico**: a `OrdemServico` já nasce `Concluída` (sem Técnico, sem Urgência), indo direto para "Custos Pendentes" do Administrador (item 12/13) — quem executa o reparo é a empresa terceirizada, fora do sistema.

### 4. Tela de Minhas Solicitações (`MinhasSolicitacoes`)
- **Estrutura:** layout cinza, barra de pesquisa e filtros em badges (`Todos`, `Pendente`, `Convertida`, `Rejeitada`) — `BarraFiltros` local.
- **Listagem & Paginação:** `useSolicitacoes({ pagina, status, busca })` → `GET /solicitacoes/minhas` devolvendo `RespostaPaginada<SolicitacaoOS>`. **Paginação e filtros são do servidor**; a tela usa `placeholderData: keepPreviousData` para não piscar entre páginas. Cards (`CardSolicitacao`) mostram número, status, tipo e descrição.
- O servidor restringe a listagem ao solicitante autenticado — não há parâmetro de "quem sou eu" no cliente.

### 5. Tela de Cadastro de Máquinas (`CadastrarMaquina` - Administrador)
- **Acesso:** Administrador (card "Máquinas" no Painel, item 12) — **não** faz parte do fluxo do Solicitante nem do Gestor. O Solicitante só enxerga as máquinas já cadastradas do seu setor (item 3).
- **Foto:** área pontilhada com preview local via `URL.createObjectURL`; o arquivo sobe como parte `foto` do multipart e o servidor devolve a `fotoUrl` definitiva na `Maquina`.
- **Campos Loja/Setor (cascata):** o Administrador escolhe a Loja e, só então, o Setor — a lista vem de `useSetores(lojaId)` e o select fica desabilitado enquanto não houver loja. **Apenas `setorId` é enviado**; a loja é derivada do setor no servidor (ver `NovaMaquinaPayload`). Trocar a loja limpa o setor escolhido, e essa limpeza fica no `onChange` do select — não num `useWatch` da loja — para não apagar o setor que o `reset()` acabou de preencher ao carregar a máquina em edição.
- **Integração de Preventivas (REGRA DE NEGÓCIO):** o envio é bloqueado sem **pelo menos uma preventiva** (`z.array(...).min(1)`). As preventivas viajam **na mesma requisição** da máquina (parte `dados` do multipart) — o servidor grava máquina e preventivas na mesma transação. `servicoMaquinas` converte cada `proximaData` de `YYYY-MM-DD` (vindo do `<input type="date">`) para `dd/mm/yyyy` antes de enviar.
- **Edição (`/cadastrar-maquina/:id`):** reaproveita a mesma tela; carrega a máquina (`servicoMaquinas.obterPorId`) e suas preventivas (`servicoPreventivas.listar({ maquinaId })`), preenchendo o formulário. Ao salvar, `PUT /maquinas/:id` **substitui** o conjunto de preventivas pelo enviado (não faz merge incremental).

### Modal / Tela de Nova Manutenção Preventiva (`ModalManutencaoPreventiva`)
- **Cabeçalho:** gradiente verde com "PAINEL DO GESTOR" (letras miúdas) e "Nova Manutenção Preventiva" em destaque, com botão de fechar (X).
- **Campos (Zod):**
  - **MÁQUINA \***: select da máquina vinculada (`maquinaId`).
  - **DESCRIÇÃO \***: `textarea` do procedimento ("Descreva o procedimento de manutenção...").
  - **INTERVALO (DIAS) \***: numérico ("Ex: 30").
  - **PRÓXIMA DATA \***: `<input type="date">` (convertido para `dd/mm/yyyy` no envio).
  - **Status (Ativa):** `Alternador` (switch) com o texto "Preventiva habilitada no sistema".
- **Botões:** "Cancelar" (neutro) e "Salvar" (verde com ícone).
- **Abertura Automática de Solicitação ao Vencer (REGRA DE NEGÓCIO):** ao chegar (ou passar) a `proximaData` de uma preventiva **ativa**, o sistema abre automaticamente uma Solicitação de OS para o Gestor aprovar, sem ação do Solicitante. Essa solicitação nasce com `origem: 'preventiva'` (`OrigemSolicitacao`) e `preventivaId`, e `solicitanteId`/`solicitanteNome` **nulos** (não houve pessoa). **Isso é um job/cron do back-end** — o front não simula mais nada disso; ele só reage ao que chega: exibe o destaque visual (`BadgeOrigemPreventiva`, borda/ícone em âmbar) no `CardSolicitacaoGestor` e no `ModalDetalhesSolicitacao`, e mostra o flag `vencida` que o servidor calcula em `PreventivaListada`.

### 6. Painel do Gestor (`PainelGestor`)
- **Navegação:** abas `Solicitações`, `OS em Andamento`, `OS Finalizadas`, `Manutenção Prev.`.
- **Fontes de dados:** `useTodasSolicitacoes` (`GET /solicitacoes`), `useOrdensServicoTodas` (`GET /ordens-servico`) e `usePreventivas` (`GET /preventivas`) — **todas já restritas ao escopo do gestor pelo servidor**.
- **Agrupamento por Loja e Setor:** listagem separada em blocos por Loja (`BlocoLoja`, ex: "Loja: Loja 2 - Filial Sul") e, dentro de cada bloco, subdividida por Setor quando o escopo não cobre a loja inteira. Escopos com `setores: 'todos'` exibem a loja sem subdivisão. Montado por `agruparPorEscopoGestor` sobre os escopos da sessão.
- **Ações por Solicitação:** cada `CardSolicitacaoGestor` tem um botão de visualização (ícone de olho) abrindo o `ModalDetalhesSolicitacao` — somente leitura, com máquina/item, loja, setor, solicitante, data/hora, status, descrição, tipo de defeito e Marcadores de Impacto. Na aba `Solicitações`, o card também tem um botão cujo rótulo depende do `tipo` (`BadgeTipoOS` identifica Maquinário/Terceiros/Reparo em toda listagem de OS): **"Abrir OS"** para `maquinario`/`reparo` (abre o `ModalAbrirOrdemServico`, item 10) e **"Aprovar"** para `terceiros` (abre o `ModalAprovarOSTerceiros`).
- **Evidências visuais no `ModalDetalhesSolicitacao`:** três blocos exibidos só quando existirem — **Foto da Máquina (cadastro)** via `solicitacao.maquinaFotoUrl` (resolvida pelo servidor, evitando uma segunda consulta só para montar o modal); **Foto do Item/Defeito** e **Vídeo do Defeito**, ambos vindos de `solicitacao.anexos` (`AnexoSolicitacao[]`, filtrados por `tipo: 'foto' | 'video'`). O rótulo da foto muda para "Foto do Item" quando `tipo === 'reparo'`. É como o Gestor avalia o problema antes de aprovar/abrir a OS.
- **Filtro por Tipo de OS:** `FiltroTipoOS` (`/src/componentes/FiltroTipoOS.tsx`) acima das abas, restringindo a `Maquinário`, `Terceiros` ou `Pequenos Reparos` (ou "Todos os tipos"). O mesmo componente é reaproveitado em `AdministradorCustosPendentes`/`AdministradorOSFinalizadas`.
- **Filtros Avançados (`ModalFiltrosOS` + `filtrosOS.ts`):** botão em `AcoesRapidas` (com contador de filtros ativos) abre um modal com **Máquina** (texto livre + sugestões via `datalist` montado a partir das OS/solicitações carregadas), **Loja** (lista fechada), **Período** (`dataInicio`/`dataFim`, comparados por `dataEstaNoIntervalo`) e **Valor mínimo/máximo**. O filtro de valor usa o **custo total já lançado** (`custoHoraTecnico + custoManutencao`); itens sem custo definido (solicitações e OS em andamento) só "combinam" quando nenhum filtro de valor está ativo. Aplicado no cliente sobre o que o servidor já devolveu.
- **Aprovação de OS Terceiros (REGRA DE NEGÓCIO):** "Aprovar" chama `servicoSolicitacoes.aprovarTerceiros` (`POST /solicitacoes/:id/aprovar-terceiros`), que marca a solicitação como `Convertida` e cria uma `OrdemServico` com `tipo: 'terceiros'`, `empresaTerceirizadaId` e `statusExecucao: 'Concluída'` (sem `tecnicoId`/`urgencia`) — ela nunca passa pela aba "OS em Andamento" nem pelo Painel do Técnico, indo direto para "Custos Pendentes" (item 12).
- **Aba "OS em Andamento" (REGRA DE NEGÓCIO — acompanhamento, não controle):** o botão `Pausar` continua sendo do Técnico (item 9) — ele é quem está na frente do problema quando falta uma peça, e fazer o Gestor aprovar cada pausa criaria um gargalo. Esta aba dá **visibilidade em tempo real**: lista toda OS com `statusExecucao !== 'Concluída'` dentro do escopo, agrupada por Loja/Setor. Cada `CardOSEmExecucao` (somente leitura, sem botões de ação) mostra técnico responsável, quando a OS foi aberta/iniciada e — com destaque em âmbar — o motivo da pausa atual (`ordem.pausaAtual.motivo`) quando `statusExecucao === 'Pausada'`.
- **Aba "OS Finalizadas" (REGRA DE NEGÓCIO):** só entra aqui a OS que passou por **todas as etapas com sucesso** — `statusExecucao === 'Concluída'` **e** `finalizada === true` (flag que o servidor calcula: Técnico encerrou **e** custo lançado). Não é baseada em `SolicitacaoOS.status === 'Convertida'` (uma solicitação "Convertida" só significa que uma OS foi aberta — o trabalho pode ainda estar rolando). Cada `CardOSFinalizada` tem os botões **Visualizar** (`Eye`) e **Imprimir** (`Printer`), abrindo o `ModalDetalhesOS` compartilhado com `contexto="Painel do Gestor"` (item 13).
- **Ações Rápidas:** o Gestor ficou restrito à operação (aprovar solicitação, abrir OS, acompanhar preventivas, filtrar). Os botões em `AcoesRapidas` são `Indicadores` (`/dashboard-gestor`, item 8) e `Filtros`. Todo cadastro/CRUD foi centralizado no Administrador (item 12); o Gestor não acessa `/cadastrar-usuario`, `/cadastrar-loja` nem `/cadastrar-setor`.
- **Setor é cadastro dinâmico, referenciado por id (REGRA DE NEGÓCIO):** não existe lista fixa de setores — quem cadastra é o Administrador (`AdministradorSetores`/`CadastrarSetor`, item 12), com nome livre e **unicidade por loja**. A antiga union estática `setoresDisponiveis`/`Setor` foi **removida**: todo setor é um `SetorCadastrado` (`/src/tipos/setor.ts`: `id`, `nome`, `lojaId`), e todo lugar que aponta para um setor usa **`setorId`**, nunca o nome. Consequências obrigatórias ao mexer em qualquer tela:
  - **Comparação é sempre por id.** Dois setores "Padaria" em lojas diferentes são registros distintos — comparar por nome os confunde. Vale para `gestorTemAcesso`/`filtrarPorAcessoGestor`/`agruparPorEscopoGestor` (`acessoGestor.ts`) e para `agruparPorSetorLoja`.
  - **Nome é só para exibição, e vem denormalizado do servidor** (`setorNome` em `Maquina`, `SolicitacaoOS`, `OrdemServico`, `PreventivaListada` e na sessão), no mesmo padrão de `lojaNome`/`maquinaNome`/`tecnicoNome`. Não monte o nome buscando numa lista quando o registro já o traz.
  - **Selects de setor são em cascata a partir da loja** (`useSetores(lojaId)`), porque a lista só faz sentido dentro de uma loja.
  - **Exceção:** `agruparPorEscopoGestor` recebe a lista de setores (`useSetores()`) além da de lojas, porque precisa nomear o cabeçalho de um subgrupo **vazio** — nesse caso não há item de onde tirar o `setorNome`.

### 7. Tela de Cadastro de Usuário (`CadastrarUsuario` - Administrador)
- **Acesso:** card "Usuários" no Painel do Administrador, rotas `/cadastrar-usuario` (criação) e `/cadastrar-usuario/:id` (edição). É onde o Administrador cria o login de Solicitantes, Técnicos, Gestores e outros Administradores (não há auto-cadastro).
- **Campos (Zod, `esquemaCadastrarUsuario`):**
  - **Perfil (Role) \***: `SeletorPerfil` (compartilhado com a Tela de Login).
  - **Nome \***, **E-mail \***, **Senha \*** (mín. 6 caracteres), **Telefone** (opcional).
  - **Loja(s) \***: seleção entre as lojas cadastradas (`useLojas`). Solicitante vincula-se a **exatamente uma** (o esquema rejeita mais de uma); Técnico e Gestor podem ter **múltiplas**. **Não se aplica ao Administrador** — para esse perfil, `CamposAcesso` esconde Loja/Setor/Área e mostra só um aviso informativo.
  - **Setor(es)**: **não aparece para Técnico nem Administrador**. Solicitante: seleção **única** (obrigatória). Gestor: seleção **múltipla**, com a alternância **"Acesso total aos setores"** que dispensa a seleção manual e equivale a `setoresIds: 'todos'` para todas as lojas marcadas. As opções são os setores **das lojas já selecionadas** (`useSetores()` filtrado por `lojasIds`) — com mais de uma loja marcada, o nome da loja entra no rótulo, porque setores homônimos em lojas diferentes são registros distintos. Desmarcar uma loja poda automaticamente os setores dela que estavam selecionados.
  - **Área de Atuação \***: **somente para Técnico**, em substituição ao Setor. Seleção única entre `areasTecnico` (`Refrigeração`, `Elétrica`, `Mecânica`, `Hidráulica`, `Máquinas em Geral`). É a área exibida junto ao nome no seletor de "Técnico Responsável" (item 10). O cadastro de Técnico **não tem** Valor/Hora — o Custo Hora é informado por ele em cada encerramento (item 11).
- **Superfície única de escrita (`servicoUsuarios`):** os quatro perfis, **inclusive Técnico**, são criados/editados/excluídos por `/usuarios`. Técnico envia `area` e tem os setores ignorados pelo servidor. No banco é a mesma tabela — manter duas superfícies de escrita permitiria o mesmo e-mail cadastrado duas vezes. `GET /tecnicos` é apenas uma **projeção somente-leitura** para o select de Técnico Responsável e para a listagem de `AdministradorTecnicos` (item 12).
- **Senha na edição:** `AtualizarUsuarioPayload` torna `senha` opcional — omitida, o servidor mantém o hash atual.
- **Observação de Modelagem:** o mesmo conjunto de setores/acesso-total é aplicado a todas as lojas marcadas no cadastro — ainda não há configuração de setores distintos por loja num único formulário (um Gestor com acesso parcial numa loja e total noutra exige editar depois).

### 8. Painel de Indicadores de Máquinas (`DashboardGestor`)
- **Acesso:** ação rápida "Indicadores" no Painel do Gestor (`/dashboard-gestor`, `perfis={['gestor']}`).
- **Seletor Dinâmico:** máquinas agrupadas por Loja e, dentro dela, por Setor, respeitando os escopos do Gestor — reaproveita `agruparPorEscopoGestor` sobre `useMaquinas()`.
- **Métricas:** `useIndicadoresMaquina(maquinaId)` → `GET /indicadores/maquinas/:id` (`IndicadoresMaquina`, `/src/tipos/indicadorMaquina.ts`), exibindo Horas Parada, MTTR, MTBF e Custo Total da máquina, além de um gráfico de rosca (paradas por Tipo de Defeito) e um de barras mensais (Custo Total, últimos 6 meses). **O cálculo é todo do servidor**, a partir do histórico real de OS encerradas (datas, pausas, `custoHoraTecnico` + `custoManutencao`).
- **Gráficos:** SVG/CSS local (`GraficoRosca`, `GraficoBarras` em `DashboardGestor/componentes/`), sem biblioteca de terceiros — consistente com a preferência do projeto por implementações nativas (ver `api.ts`). Paleta categórica fixa por tipo de defeito em `coresTipoDefeito.ts`.

### 9. Tela Principal do Técnico (`PainelTecnico`)
- **Acesso:** o login com perfil Técnico traz `tecnicoId` no payload da sessão e redireciona para `/painel-tecnico` (`perfis={['tecnico']}`). A listagem usa `useOrdensServicoTecnico(tecnicoId)` → `GET /ordens-servico?tecnicoId=` — **o servidor restringe às OS do técnico autenticado**; o id vai junto apenas para compor a chave de cache. Inclui OS de Maquinário e de Pequenos Reparos; OS Terceiros **nunca** aparece aqui (não tem `tecnicoId`).
- **Abas:** `OS em Aberto` (padrão — status `Aberta` e `Em Andamento`), `Pendentes / Pausadas` (status `Pausada`) e `OS Concluídas`.
- **Aba "OS Concluídas" usa a flag `finalizada` (REGRA DE NEGÓCIO):** lista as OS com `ordem.finalizada === true`, a mesma regra de "OS Finalizada" do Gestor e do Administrador (itens 6/13). Para Maquinário/Reparo o Técnico já preenche `custoManutencao` no encerramento (item 11), então a OS costuma entrar direto nessa aba; uma OS encerrada mas ainda sem custo lançado fica invisível nas abas dele até o lançamento.
- **Agrupamento por Setor + Loja:** dentro de cada aba, blocos por combinação de Setor e Loja (ex: "Açougue - Loja 1"), via `agruparPorSetorLoja` (`/src/utilitarios/agruparPorSetorLoja.ts`) + `BlocoSetorLoja`. É agrupamento **visual** (sem regra de acesso, diferente do `agruparPorEscopoGestor`), útil porque um Técnico pode atender múltiplas lojas.
- **Ver a solicitação de origem:** o card tem uma ação que busca `servicoSolicitacoes.obterPorId(ordem.solicitacaoId)` e abre o `ModalDetalhesSolicitacao` — o Técnico vê a foto/vídeo do defeito e os impactos informados pelo Solicitante.
- **Sem Valor/Hora cadastrado (REGRA DE NEGÓCIO):** o Técnico não tem `valorHora` fixo no cadastro (itens 7/12) — ele informa o Custo Hora em cada encerramento (item 11), podendo variar por OS.
- **Ciclo de Vida da OS (`StatusExecucaoOS`):** `Aberta` → `Em Andamento` → `Concluída`, com `Pausada` acessível a partir de `Aberta` ou `Em Andamento`. Cada transição é **uma chamada ao servidor**, que devolve a OS atualizada:
  - **Aberta:** recém-atribuída pelo Gestor, não iniciada. Card mostra `Pausar` e `Iniciar Atendimento`.
  - **Iniciar Atendimento:** `POST /ordens-servico/:id/iniciar` — o servidor grava `dataInicio` e abre a primeira sessão de trabalho. Card passa a mostrar `Pausar` e `Finalizar OS` (destaque verde, abre o modal do item 11).
  - **Pausar:** abre `ModalPausarOrdemServico` (Zod + `textarea` obrigatória para o motivo, ex: "aguardando peça") e chama `POST /ordens-servico/:id/pausar` com `{ motivo }`. O servidor registra uma `PausaOrdemServico` (com `pausadaEm` e o `statusAnterior`) e o card exibe `pausaAtual.motivo`.
  - **Retomar Atendimento:** `POST /ordens-servico/:id/retomar` — o servidor devolve a OS ao `statusAnterior` registrado na pausa, fecha a pausa (`retomadaEm`) e reabre a sessão de trabalho quando volta para `Em Andamento`.
  - **Concluída:** somente leitura; o card tem um botão de visualização (ícone de olho) abrindo o `ModalDetalhesEncerramento` com os dados de `ordem.encerramento`.
- **Lacuna conhecida — sem auditoria de "quem" fez cada transição:** o modelo grava **quando** (`dataInicio`, `pausadaEm`/`retomadaEm` em cada `PausaOrdemServico`) mas não **quem** iniciou, pausou ou retomou. Hoje isso só é *inferível* — `tecnicoId` é fixo na OS e o servidor só aceita `iniciar`/`pausar`/`retomar` do técnico responsável (ver RBAC) — não é uma auditoria de verdade: não é uma linha própria com ator + timestamp + de/para, e quebra no dia em que uma OS puder trocar de técnico. Não existe uma tabela de eventos genérica (`os_evento`: `status_anterior`, `status_novo`, `usuario_id`, `ocorrido_em`) cobrindo toda transição numa timeline só — ver "Pontos em aberto" em `docs/modelagem-banco-dados.md`.
- **Horas Trabalhadas vs. Horas Parada (REGRA DE NEGÓCIO — dois relógios independentes):**
  - **Horas Parada** (máquina indisponível) corre **sem interrupção** de `dataAbertura` até `dataFim` — não desconta pausas do técnico, porque a máquina segue parada mesmo enquanto ele espera uma peça.
  - **Horas Trabalhadas** (mão-na-massa) soma apenas as sessões de trabalho, fechadas a cada pausa e reabertas a cada retomada.
  - **Ambas são calculadas pelo servidor** a partir de `dataAbertura`/`dataInicio`/`dataFim` e do histórico de `pausas`, e chegam prontas em `ordem.horasTrabalhadas` / `ordem.horasParada` (só existem em OS encerrada). O utilitário `calcularHoras` (`/src/utilitarios/calcularHoras.ts`) é usado **apenas como prévia visual** no modal de encerramento, antes de o servidor responder.

### Modal de Pausa de OS (`ModalPausarOrdemServico` - Técnico)
- **Cabeçalho:** padrão dos demais modais — gradiente verde, "PAINEL DO TÉCNICO" em letras miúdas e "Pausar OS · #id" em destaque.
- **Aviso:** deixa explícito que a pausa só afeta o relógio de horas do técnico — o tempo de máquina parada continua contando.
- **Campo:** `Motivo da Pausa *` (`textarea`, Zod obrigatório, ex: "Aguardando peça de reposição do fornecedor.").
- **Botões:** `Cancelar` (neutro) e `Pausar OS` (verde, com ícone).

### 10. Modal de Abertura de OS (`ModalAbrirOrdemServico` - Gestor)
- **Reaproveitado por Maquinário e Pequenos Reparos:** o mesmo modal atende `tipo: 'maquinario'` e `tipo: 'reparo'` — ambos precisam de Técnico + Urgência. `tipo: 'terceiros'` usa modal próprio (`ModalAprovarOSTerceiros`).
- **Nível de Urgência \***: cards coloridos (Baixa/Média/Alta → `IdUrgencia`).
- **Técnico Responsável \***: select com os técnicos disponíveis para a loja da solicitação (`useTecnicos(lojaId)` → `GET /tecnicos?lojaId=`), exibindo nome **e área de atuação** (ex: "Roberto Alves — Refrigeração").
- **Data/Hora:** exibida como confirmação (`new Date()` local), **não é campo editável e não é enviada** — o instante da abertura é fato do servidor.
- Os **Marcadores de Impacto** **não** são preenchidos aqui — vêm do Solicitante (item 3) e são exibidos no `ModalDetalhesSolicitacao` (item 6).
- **Ao salvar:** `servicoSolicitacoes.abrirOS` → `POST /solicitacoes/:id/abrir-os` com `{ urgencia, tecnicoId }`; o servidor cria a `OrdemServico` e marca a solicitação como `Convertida`. A tela invalida `['solicitacoes-os-todas']` e `['ordens-servico-todas']`.

### Modal de Aprovação de OS Terceiros (`ModalAprovarOSTerceiros` - Gestor)
- **Acesso:** botão "Aprovar" num card com `tipo: 'terceiros'` na aba `Solicitações` — mesmo padrão visual do `ModalAbrirOrdemServico`.
- **Campo único:** **Empresa Terceirizada \*** — select alimentado por `useEmpresasTerceirizadas` (`GET /empresas-terceirizadas`), com nome e especialidade. Sem Urgência e sem Técnico (item 3c).
- **Data/Hora:** exibida como confirmação, mesmo padrão do item 10.
- **Ao salvar:** `servicoSolicitacoes.aprovarTerceiros` → `POST /solicitacoes/:id/aprovar-terceiros` com `{ empresaTerceirizadaId }`; o servidor cria a OS já `Concluída` e marca a solicitação como `Convertida`.

### 11. Modal de Encerramento de OS (`ModalEncerrarOrdemServico` - Técnico)
- **Acesso:** botão `Finalizar OS` do card, disponível apenas com a OS `Em Andamento` (item 9).
- **Formulário de Execução (`esquemaEncerrarOrdemServico`, todos obrigatórios):**
  - **Início / Término do Atendimento:** somente leitura. `dataInicio` é o instante gravado quando o Técnico clicou em "Iniciar Atendimento"; o término é o `agoraParaBackend()` capturado na abertura do modal. São **confirmação visual** — o servidor grava os instantes definitivos.
  - **Horas Trabalhadas** e **Horas Parada:** exibidas automaticamente, somente leitura, como **prévia local** (`calcularHoras`) para o Técnico conferir. Os valores definitivos vêm calculados pelo servidor a partir do histórico de pausas e voltam na resposta.
  - **Custo Hora do Técnico (R$) \*** e **Custo de Manutenção (R$) \*** (REGRA DE NEGÓCIO): **preenchidos manualmente pelo próprio Técnico** — dois campos numéricos (`type="number"`, `step="0.01"`) validados via Zod (`z.number().nonnegative().max(999999)`), sem cálculo automático (o Técnico não tem `valorHora` cadastrado). A OS de Maquinário/Reparo sai daqui já com o **Custo Total** completo (`custoHoraTecnico + custoManutencao`).
  - **Defeito Constatado \***, **Causa Raiz \*** e **Solução \***: `textarea` de 10 a 500 caracteres cada.
- **Botões:** `Cancelar` (neutro) e `Encerrar OS` (verde, com ícone).
- **Ao salvar:** `servicoOrdensServico.encerrar` → `POST /ordens-servico/:id/encerrar` (`EncerramentoOrdemServicoPayload`). Os textos ficam em `ordem.encerramento` (junto com `encerradoPorNome`) e os valores em `ordem.custo`, disponíveis depois no `ModalDetalhesEncerramento` (aba `OS Concluídas`) e no `ModalDetalhesOS` (item 13).

### 12. Painel do Administrador (`PainelAdministrador` - 4º perfil)
- **Perfil:** `administrador`, com acesso total ao tenant (sem escopo de Loja/Setor). Login redireciona para `/painel-administrador` (`perfis={['administrador']}`).
- **Home do Painel:** cards de navegação (`CardAcao`) para `Usuários`, `Lojas`, `Setores`, `Técnicos`, `Máquinas`, `Empresas Terceirizadas`, `Custos Pendentes` e `OS Finalizadas`.
- **CRUD Completo em cada entidade:** telas de listagem próprias (`AdministradorUsuarios`, `AdministradorLojas`, `AdministradorSetores`, `AdministradorTecnicos`, `AdministradorMaquinas`, `AdministradorEmpresasTerceirizadas`) com **barra de busca** (`CampoBusca`), **filtros** (por perfil/loja/setor conforme a entidade), **Editar** (ícone lápis → tela de cadastro em modo edição via `/:id`, ou `ModalEditarTecnico` no caso de Técnicos) e **Excluir** (ícone lixeira + `ModalConfirmarExclusao`). Mobile-First obrigatório: cada linha empilha em coluna (`flex-col`) até `sm`, virando linha (`sm:flex-row sm:justify-between`) a partir daí, com `min-w-0`/`truncate` para não estourar em telas estreitas.
- **Empresas Terceirizadas:** entidade simples (`EmpresaTerceirizada`: `nome`, `especialidade?`, `telefone?`), sem vínculo de Loja/Setor — cadastrada aqui e consumida pelo Gestor no `ModalAprovarOSTerceiros` (item 6).
- **Técnicos — leitura e escrita separadas:** `AdministradorTecnicos` **lê** de `useTecnicos` (`GET /tecnicos`) e **escreve** via `servicoUsuarios.atualizar`/`deletar` (`/usuarios`), porque Técnico é um usuário com perfil `'tecnico'` (ver item 7). O botão "Novo Técnico" leva para `/cadastrar-usuario`.
- **Paginação — duas estratégias:**
  - **Servidor:** `AdministradorUsuarios` passa `busca`/`perfil`/`lojaId`/`pagina` para `GET /usuarios` e usa `resposta.dados` + `resposta.totalPaginas`.
  - **Cliente:** as demais listagens recebem array simples e paginam com `Array.slice` em blocos de **10** (`TAMANHO_PAGINA`), usando o componente compartilhado `Paginacao` (`/src/componentes/Paginacao.tsx`).
  - Em ambos os casos, a página volta para 1 quando busca/filtros mudam — ajuste feito **durante a renderização**, comparando uma chave dos filtros com o valor anterior, e não em `useEffect` (evita `setState` dentro de efeito).
- **Custos Pendentes (`AdministradorCustosPendentes`):** lista **toda** OS `Concluída` (`useOrdensServicoTodas({ status: ['Concluída'], busca, lojaId, tipo })`), com ou sem custo já lançado — busca, filtro por loja e `FiltroTipoOS` são resolvidos pelo servidor. Card e `ModalLancarCustoManutencao` mudam conforme o tipo:
  - **Maquinário/Reparo:** card mostra "Encerrada em" (`dataFim`), **Custo Hora do Técnico** e **Custo de Manutenção** (`—` quando vazios). O modal abre com **Horas Trabalhadas** (somente leitura) e os campos **Custo Hora Técnico (R$)** (opcional) e **Custo de Manutenção (R$) \*** (obrigatório), já pré-preenchidos pelo Técnico no encerramento (item 11) — o Administrador só edita para corrigir.
  - **Terceiros (REGRA DE NEGÓCIO — sem Técnico):** **não tem Custo Hora do Técnico nem Horas Trabalhadas** — nenhum dos dois aparece no card nem no modal. No lugar de "Encerrada em", ambos mostram **"Aceita pelo Gestor em"**, usando `ordemServico.dataAbertura` (o instante da aprovação — `dataAbertura`/`dataInicio`/`dataFim` nascem iguais nessa OS, mas só `dataAbertura` é usada aqui). O modal tem **Custo de Manutenção (R$) \*** mais o campo exclusivo **Descrição do Serviço Realizado \*** (`textarea`, Zod `min(10)`, via `criarEsquemaLancarCustoManutencao(ehTerceiros)`) — além do valor da nota, o Administrador registra o que a empresa efetivamente fez, já que essa OS nunca passa pelo Técnico. Esse texto vai em `descricaoServico` e aparece como "Solução Aplicada" no `ModalDetalhesOS`.
  - **Ao salvar:** `servicoOrdensServico.lancarCustoManutencao` → `POST /ordens-servico/:id/custo` (`LancamentoCustoManutencaoPayload`) envia apenas os campos informados — para Terceiros, `custoHoraTecnico` nunca é enviado.
- **OS Finalizadas (`AdministradorOSFinalizadas`):** ver item 13.

### 13. OS Finalizadas e Impressão de OS (Administrador + Gestor)
- **Regra de Negócio — o que conta como "finalizada":** a OS passou por **todas as etapas com sucesso**: o Técnico encerrou o atendimento (item 11) **e** o custo de manutenção foi lançado (item 12). **Essa regra é resolvida no servidor e chega pronta na flag `ordem.finalizada`** — nenhuma tela recalcula. É o complemento exato de "Custos Pendentes".
- **Duas entradas para a mesma regra:**
  - **Administrador** (`AdministradorOSFinalizadas`, `/administrador/os-finalizadas`): `useOrdensServicoTodas({ finalizada: true, busca, lojaId, tipo })` — **todas** as OS finalizadas do tenant, com paginação client-side (10/página).
  - **Gestor** (aba `OS Finalizadas` do `PainelGestor`, item 6): as finalizadas **dentro do seu escopo** (restringido pelo servidor), agrupadas por Loja/Setor.
- **`ModalDetalhesOS` (compartilhado, `/src/paginas/ModalDetalhesOS/`):** modal somente leitura reaproveitado pelas duas telas (a prop `contexto` troca o rótulo do cabeçalho — "Painel do Administrador" ou "Painel do Gestor") com máquina/item, loja, setor, solicitante, urgência (quando houver — OS Terceiros não tem), datas de abertura/início/término, Horas Trabalhadas, Custo Hora do Técnico, Custo Manutenção, Custo Total e os textos de Defeito Constatado/Causa Raiz/Solução. O campo "Técnico Responsável" vira **"Empresa Terceirizada"** quando `ordemServico.tipo === 'terceiros'` (usando `empresaTerceirizadaNome`, que já vem na OS). `BadgeTipoOS` identifica o tipo no cabeçalho. Cada card na listagem tem `Eye` (**Visualizar**) e `Printer` (**Imprimir**, abre o modal já disparando a impressão via prop `autoImprimir`).
- **Impressão (atual: `@media print` no front):** o conteúdo do modal fica num contêiner com `id="area-impressao-os"`, e uma regra `@media print` global (`index.css`) esconde o resto da aplicação (`body * { visibility: hidden }`) e mostra só esse contêiner — os botões `Fechar`/`Imprimir` e o cabeçalho verde levam `print:hidden`. O endpoint de PDF do servidor já existe no contrato (`servicoOrdensServico.obterPdfImpressao` → `GET /ordens-servico/:id/impressao`, devolvendo Blob) mas **ainda não está ligado a nenhuma tela** — trocar a impressão local pelo PDF do back-end é o passo seguinte.

## Helpers de Domínio (evite reimplementar)
- **`alvoOS.ts`** — Solicitação e OS apontam ou para uma máquina cadastrada (Maquinário/Terceiros) ou para um item digitado na hora (Pequeno Reparo). Use `obterNomeAlvo`, `obterCodigoAlvo` e `combinaBuscaAlvo` em vez de repetir o encadeamento `maquinaNome ?? itemDescricao ?? '—'`.
- **`dataBackend.ts`** — toda conversão de data que entra ou sai da API (ver "Contrato com o Back-end").
- **`dataEstaNoIntervalo.ts`** — compara uma data do back-end com um intervalo vindo de `<input type="date">`, convertendo para `YYYY-MM-DD` e comparando lexicograficamente (equivale à comparação cronológica, sem construir `Date` e sem depender de fuso).
- **`acessoGestor.ts`** — agrupamento/checagem por escopo do Gestor (organização visual; a restrição real é do servidor).
- **`agruparPorSetorLoja.ts`** — agrupamento visual do Painel do Técnico.
- **`calcularHoras.ts`** — prévia local de horas; os valores oficiais vêm do servidor.
- **`formatarData.ts` / `formatarMoeda.ts`** — formatação de exibição (pt-BR / BRL).
