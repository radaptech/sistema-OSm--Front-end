# Contexto do Projeto - Front-end (EPI SaaS / Solicitação OS)

## Regra de Autonomia Absoluta
- **Execução Direta:** Nunca peça confirmações óbvias, validações intermediárias ou permissões para prosseguir com o que foi solicitado. Se o comando foi dado, execute a tarefa por completo, gere o código necessário de ponta a ponta e apresente o resultado final de forma autônoma.

## Regra de Integração e Navegação Real
- **Simulação de Aplicação Real:** Nenhuma tela deve ser tratada como um componente isolado ou estático. Todas as telas recém-criadas DEVEM ser interligadas de verdade através do React Router DOM, permitindo a navegação completa de ponta a ponta (ex: clicar em "Minhas Solicitações" na Home direciona para a tela de listagem, clicar em "Nova OS" abre o formulário, etc.).
- **Estado de Autenticação / Mock de Sessão:** Utilize um contexto ou estado global leve (Zustand) para simular o perfil ativo (Solicitante, Técnico, Gestor) e o nome do usuário logado, garantindo que o fluxo de login redirecione corretamente para o painel correspondente de forma dinâmica.

## Tech Stack e Infraestrutura
- **Framework & Build:** React 19+ com TypeScript, empacotado via **Vite**.
- **Roteamento:** React Router DOM (com implementação de Rotas Protegidas).
- **Estilização:** Tailwind CSS (Mobile-First obrigatório).
- **Ícones:** Lucide React.
- **Gerenciamento de Formulários:** React Hook Form integrado com **Zod** para validação de esquemas.
- **Busca de Dados & Cache:** TanStack Query (React Query) para chamadas HTTP, cache de listas e painéis de indicadores (dashboards).
- **Gerenciamento de Estado Global:** Zustand (ou Context API nativa) com foco principal no controle de Modais globais.
- **Qualidade de Código (Linting & Formatting):** ESLint e Prettier (utilizando o plugin `prettier-plugin-tailwindcss` para ordenação automática das classes).
- **Cliente HTTP:** Wrapper customizado nativo (Fetch API), substituindo bibliotecas de terceiros como Axios.
- **Notificações/Alertas:** React-Toastify (Para feedback global de erros, sucesso e avisos).

## Estrutura de Pastas e Organização do Código
A arquitetura do projeto deve seguir uma separação clara de responsabilidades e **adotar estritamente a nomenclatura em Português-BR**:
- **Idioma do Código (Português-BR):** Nomenclaturas de pastas, componentes, funções, variáveis e arquivos devem ser em Português (ex: `Botao` em vez de `Button`, `formatarData` em vez de `formatDate`). Apenas prefixos/termos nativos do React (como `use` para hooks) devem ser mantidos.
- **Modularização e Limite de Tamanho (REGRA DE OURO):** Evite arquivos gigantes. Se um arquivo começar a ficar muito extenso e complexo, ele **DEVE** ser dividido em partes menores (criação de subcomponentes, divisão lógica de arquivos ou extração de regras de negócio para hooks/utilitários independentes).
- **`/src/componentes`**: Componentes visuais isolados e reaproveitáveis (ex: `Botao`, `CampoTexto`, `CardMaquina`). Devem ser "burros" (receber apenas props) sempre que possível.
- **`/src/paginas`** (ou `/telas`): Telas completas da aplicação (ex: `PainelGestor.tsx`, `TelaLogin.tsx`). Montagem de layout e consumo de hooks/queries. Se a página for muito complexa, crie uma subpasta para ela com seus componentes locais (ex: `/src/paginas/PainelGestor/componentes/`).
- **`/src/servicos`**: Configuração do cliente HTTP customizado e abstração de endpoints (ex: `api.ts`, `servicoMaquinas.ts`).
- **`/src/hooks`**: Ganchos customizados, incluindo os do React Query (ex: `useMaquinas.ts`, `useAutenticacao.ts`).
- **`/src/estado`**: Gerenciamento de estados globais (Zustand), especialmente para a **Máquina de Modais** (evitando propagação excessiva de `useState` entre componentes).
- **`/src/utilitarios`**: Funções puras (ex: `formatarData.ts`, `formatarMoeda.ts`).
- **`/src/rotas`**: Configuração do roteamento, separando rotas públicas das rotas protegidas por perfil (Gestor, Técnico, Solicitante).
- **`/src/tipos`**: Tipagens estritas do TypeScript (interfaces refletindo o banco de dados PostgreSQL).

## Autenticação, Segurança e Regras de Negócio (IMPORTANTE)
- **Arquitetura Multi-Locatário (Multi-Tenant) Baseada em Subdomínio:** O sistema atende a múltiplos clientes. O `tenantId` é extraído dinamicamente do subdomínio da URL atual (`window.location.hostname.split(".")[0]`) e deve ser injetado em todas as requisições via header estrito `X-tenant-ID`.
- **Gerenciamento de Sessão via Cookies:** O token JWT retornado pelo back-end é gerenciado via **Cookies HttpOnly**. É terminantemente proibido armazenar o JWT em `localStorage` ou variáveis globais. O cliente HTTP deve usar `credentials: "include"`.
- **Tratamento Global de Erros (401 Não Autorizado):** Se a API retornar status 401 e a rota atual não for `/login`, o sistema deve interceptar a falha, disparar um alerta via React-Toastify ("Sua sessão expirou") e redirecionar o usuário forçosamente para o Login.
- **Controle de Acesso por Setor (Gestor):** O acesso do Gestor é rigidamente delimitado pelo(s) setor(es) sob sua responsabilidade (podendo ser um ou múltiplos). O sistema garante que ele só visualize OS/máquinas do seu domínio, criando separadores visuais na listagem quando múltiplos setores estiverem envolvidos.

## Configuração Base de API (`api.ts`) & Variáveis de Ambiente
Todo o tráfego HTTP passa por um wrapper nativo (`fetch`) padronizado.
- **Variáveis de Ambiente:** O projeto deve conter um arquivo `.env.example` na raiz documentando as variáveis necessárias (ex: `REACT_APP_URL_API`).
- O script `api.ts` utiliza `process.env.REACT_APP_URL_API` com fallback para a URL de homologação. Garante formatação com `https://` caso omitido.
- **Cabeçalhos Automáticos:** Injeta `Content-Type: application/json` (exceto quando o corpo da requisição for `FormData` para uploads) e o `X-tenant-ID`.
- **Resolução de Resposta:** Lê corretamente respostas JSON, Texto ou arquivos Binários/Blob (como PDF para impressão de OS).
- **Integração de Alertas:** Captura chaves de erro do backend (`error`, `erro`, `message`, `detalhes`) e exibe o toast (notificação) automaticamente.

## Especificações de Telas

### 1. Tela de Login (`TelaLogin`)
- **Fundo Global:** Gradiente suave em tons de verde escuro.
- **Card Central:** Fundo branco, cantos arredondados (`rounded-2xl`), padding generoso interno, largura fixa elegante (`max-w-md`), com sombra suave.
- **Cabeçalho do Card:** Título "Solicitação OS" centralizado, negrito e escuro. Subtítulo "LOGIN DE ACESSO" em letras maiúsculas, menor e em tom de verde claro/cinza.
- **Labels dos Campos:** Todas as labels ("PERFIL", "LOGIN", "SENHA DE ACESSO") devem ser em letras maiúsculas, fonte pequena (`text-xs`), peso médio e cor verde/cinza clara.
- **Seletor de Perfil (Tabs):** Fundo do container em tom muito claro de cinza/verde, formato de pílula (`rounded-full`), contendo ícones da biblioteca Lucide ao lado do texto (ex: `User`, `Wrench`, `ShieldCheck`). A aba ativa deve ter fundo verde escuro e texto branco. Abas inativas com fundo transparente e texto verde.
- **Campos de Input (E-mail e Senha):** Devem possuir um fundo amarelado/esverdeado muito claro (ex: `bg-lime-50` ou similar), sem bordas fortes, cantos arredondados (`rounded-lg`), texto em verde escuro. O ícone de visibilidade da senha deve ser verde.
- **Link Auxiliar:** "Esqueci minha senha" alinhado à direita, com fonte pequena e cor verde.
- **Botão Principal:** Botão "Entrar" com fundo verde escuro sólido, texto branco e cantos arredondados.
- **Rodapé do Card:** Texto "SOLICITAÇÃO OS © 2026" centralizado na base do card, fonte muito pequena e cor cinza clara.

### 2. Tela Principal do Solicitante (`HomeSolicitante`)
- **Fundo Global:** Cinza sólido uniforme (`bg-slate-600`), estruturado de ponta a ponta (header superior verde, conteúdo centralizado e footer discreto).
- **Header Superior:** Faixa em verde escuro alinhada de ponta a ponta. Contém no canto esquerdo o título "SOLICITAÇÃO OS" em destaque pequeno e logo abaixo a saudação personalizada ("Olá, `nome do usuario logado`"). No canto direito, ficam os ícones de Notificações (sino) e Sair (logout).
- **Área Central:** Título principal centralizado "O que deseja fazer?" acompanhado do subtítulo descritivo.
- **Cards de Ação (Esquema de Cores Obrigatório):** 
  - Os botões/cards de navegação centralizados em largura moderada.
  - O card "Minhas Solicitações" possui fundo cinza escuro secundário (`bg-slate-700`) com ícone e texto explicativo.
  - Apenas o card principal ("Nova Solicitação OS") possui destaque preenchido em verde sólido (`bg-emerald-600` ou similar) com ícone de adição.
  - O card "cadastrar máquinas" possui as cores de "Minhas Solicitações"
- **Cards de Estatísticas (Grid Inferior):** Três pequenos blocos cinzas lado a lado exibindo os contadores numéricos centralizados com seus respectivos rótulos abaixo (`Abertas`, `Em andamento`, `Concluídas`).
- **Rodapé:** Texto discreto centralizado na base `SOLICITAÇÃO OS © 2026`.

### 3. Tela de Nova Solicitação OS (`NovaSolicitacaoOS`)
- **Formulário Complexo (Zod + React Hook Form):** 
  - **Máquina:** Seleção atrelada a uma pré-visualização de foto (`object-contain`).
  - **Tipo de Defeito:** Seleção fixa (`Mecânico`, `Elétrico`, `Hidráulico`, `Pneumático`, `Software / CNC`, `Estrutural`).
  - **Setor / Solicitante:** Preenchimento automático (somente leitura).
  - **Descrição:** Área de texto (`textarea`) com validação de limite de caracteres.
- **Ação:** Enviar Solicitação.

### 4. Tela de Minhas Solicitações (`MinhasSolicitacoes`)
- **Estrutura:** Layout cinza, barra de pesquisa, filtros em rótulos/badges (`Todos`, `Pendente`, `Convertida`, `Rejeitada`).
- **Listagem & Paginação:** Cards detalhados com número da OS, status e descrição. Integrado ao TanStack Query para paginação otimizada.

### 5. Tela de Cadastro de Máquinas (`CadastrarMaquina` - Gestor)
- **Modal/Tela:** Envio de foto (área pontilhada) e campos primários. 
  - **Estratégia de Envio de Arquivo:** O envio da imagem da máquina DEVE ser feito utilizando o objeto nativo `FormData` multipart para eficiência, gerenciado de forma transparente pelo `api.ts`.
- **Integração de Preventivas (REGRA DE NEGÓCIO):** O envio do formulário é bloqueado se não houver **pelo menos uma manutenção preventiva** configurada no mesmo fluxo. Array de preventivas validado via Zod.

### Modal / Tela de Nova Manutenção Preventiva (`ModalManutencaoPreventiva`)
- **Cabeçalho:** Fundo verde escuro com título "PAINEL DO GESTOR" (em letras miúdas) e "Nova Manutenção Preventiva" (em destaque), com botão de fechar (X) no canto superior direito.
- **Campos do Formulário (Validação Zod obrigatória):**
  - **MÁQUINA \***: Select para escolha da máquina vinculada (`idMaquina` / `Selecionar máquina...`).
  - **DESCRIÇÃO \***: Campo de texto (`textarea`) para descrever o procedimento detalhado da manutenção ("Descreva o procedimento de manutenção...").
  - **INTERVALO (DIAS) \***: Campo numérico indicando a frequência em dias ("Ex: 30").
  - **PRÓXIMA DATA \***: Campo de data (`dd/mm/aaaa`) com seletor de calendário nativo.
  - **Status (Ativa):** Componente de alternância (*switch* / *toggle*) acompanhado do texto descritivo "Preventiva habilitada no sistema".
- **Botões de Ação:** Botão "Cancelar" com borda e fundo neutro, e botão "Salvar" sólido em verde com ícone de confirmação.

### 6. Painel do Gestor (`PainelGestor`)
- **Navegação:** Abas para `Solicitações`, `OS Finalizadas`, `Manutenção Prev.`.
- **Filtro Setorial Obrigatório:** Listagem separada visualmente em blocos caso o gestor responda por mais de um setor (Ex: Cabeçalho divisor "Setor: Usinagem").
- **Ações Rápidas:** Botões superiores para `Cadastrar Técnico`.

### 7. Painel de Indicadores de Máquinas (`DashboardGestor`)
- **Seletor Dinâmico:** Máquinas agrupadas por setor.
- **Métricas (via React Query):** Exibição em tempo real de Horas Parada, MTTR, MTBF, Custo Total, gráficos de rosca e barras mensais.

### 8. Tela Principal do Técnico (`PainelTecnico`)
- **Abas e Filtros:** `OS em Aberto` (padrão), `Pendentes / Pausadas` (espera de peças) e `OS Concluídas`.
- **Listagem de OS:** Botões de ação direta integrados ao card. "Finalizar OS" possui destaque em verde.

### 9. Modal de Abertura de OS (`ModalAbrirOrdemServico` - Gestor)
- **Nível de Urgência:** Cards coloridos (Baixa/Média/Alta mapeado para `IdUrgencia`).
- **Marcadores de Impacto:** Caixas de seleção (checkbox) mapeadas diretamente (`Afeta Produção`, `Parada Parcial`, `Retrabalho`).
- **Campos de Controle:** Data/Hora e vínculo com Técnico Responsável.

### 10. Modal de Encerramento de OS (`ModalEncerrarOrdemServico` - Técnico)
- **Formulário de Execução:** Validação rígida Zod para campos críticos.
  - `dataInicio` / `dataFim` (período).
  - `horaEstimada` / `custo` (financeiro).
  - Áreas de texto amplas: `defeitoConstatado`, `causaRaiz`, `solucao`.
- Envio utiliza o `api.ts` nativo e exibe notificação (toast) de erro/sucesso via validação global.