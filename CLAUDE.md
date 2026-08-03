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
- **Hierarquia Organizacional (Tenant > Loja > Setor):** Cada tenant (cliente SaaS, identificado pelo subdomínio) pode possuir múltiplas Lojas (unidades/filiais), e cada Loja possui seus próprios Setores. Máquinas e Ordens de Serviço pertencem sempre a uma Loja + Setor específicos (`lojaId` + `setor`), definidos em `/src/tipos/loja.ts` e `/src/tipos/maquina.ts`.
- **Controle de Acesso por Loja e Setor (Gestor):** O acesso do Gestor é definido por uma lista de **escopos** (`EscopoAcessoGestor[]`, em `/src/tipos/autenticacao.ts`), onde cada escopo vincula uma Loja a um conjunto de setores. Um escopo pode ser:
  - **Restrito a setores específicos** dentro de uma Loja (`setores: Setor[]`) — ex: Gestor que responde apenas pelos setores "Padaria" e "Açougue" da Loja 1, enquanto outro Gestor da mesma loja responde por "Hortifruti" e "Peixaria".
  - **Total sobre uma Loja inteira** (`setores: 'todos'`) — ex: Gestor que responde por todos os setores das Lojas 2 e 3 simultaneamente (um Gestor pode ter múltiplos escopos, cobrindo múltiplas lojas ao mesmo tempo).
  O sistema garante que o Gestor só visualize OS/máquinas dentro dos seus escopos (`gestorTemAcesso` / `filtrarPorAcessoGestor` em `/src/utilitarios/acessoGestor.ts`), criando separadores visuais na listagem agrupados por Loja e, dentro dela, por Setor quando múltiplos estiverem envolvidos.

- **Controle de Acesso por Setor (Solicitante):** O Solicitante está vinculado a exatamente uma Loja + um Setor (`lojaId`/`setor` em `useEstadoAutenticacao`, definidos no momento do login). Ao abrir uma Nova Solicitação OS, ele só pode visualizar e selecionar **máquinas do seu próprio setor** — ex: um solicitante do Açougue só vê as máquinas do Açougue, nunca as da Padaria ou de outra loja. O filtro é aplicado via `useMaquinas({ setor, lojaId })`, que repassa os parâmetros para `servicoMaquinas.listar`.
- **Rotas Protegidas por Perfil:** `RotaProtegida` (`/src/rotas/RotaProtegida.tsx`) aceita uma prop opcional `perfis?: PerfilLogin[]`. Sem autenticação, redireciona para `/login`; autenticado mas com perfil fora da lista `perfis`, redireciona para a rota inicial do próprio perfil (`ROTA_POR_PERFIL[perfil]`) em vez de deixar renderizar. Em `RotasPrincipais.tsx`, as rotas de Solicitante/Técnico (`/home-solicitante`, `/nova-solicitacao-os`, `/minhas-solicitacoes`, `/cadastrar-maquina`) usam `perfis={['solicitante', 'tecnico']}`, e as rotas de Gestor (`/painel-gestor`, `/cadastrar-usuario`, `/cadastrar-setor`, `/cadastrar-loja`) usam `perfis={['gestor']}` — evitando que, por exemplo, um Solicitante acesse o Painel do Gestor digitando a URL diretamente.

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
  - **Máquina:** Seleção atrelada a uma pré-visualização de foto (`object-contain`). A lista é restrita apenas às máquinas do setor/loja do solicitante logado.
  - **Tipo de Defeito:** Seleção fixa (`Mecânico`, `Elétrico`, `Hidráulico`, `Pneumático`, `Software / CNC`, `Estrutural`).
  - **Setor / Solicitante:** Preenchimento automático (somente leitura).
  - **Descrição:** Área de texto (`textarea`) com validação de limite de caracteres.
  - **Marcadores de Impacto:** Caixas de seleção (checkbox) preenchidas pelo próprio Solicitante no momento do pedido (`Afeta Produção`, `Parada Parcial`, `Retrabalho`), definidas em `marcadoresImpacto`/`MarcadorImpacto` (`/src/tipos/ordemServico.ts`). Fazem parte de `SolicitacaoOS`/`NovaSolicitacaoOSPayload` e ficam visíveis para o Gestor ao visualizar a solicitação (ver item 6).
- **Ação:** Enviar Solicitação.

### 4. Tela de Minhas Solicitações (`MinhasSolicitacoes`)
- **Estrutura:** Layout cinza, barra de pesquisa, filtros em rótulos/badges (`Todos`, `Pendente`, `Convertida`, `Rejeitada`).
- **Listagem & Paginação:** Cards detalhados com número da OS, status e descrição. Integrado ao TanStack Query para paginação otimizada.

### 5. Tela de Cadastro de Máquinas (`CadastrarMaquina` - Solicitante)
- **Acesso:** Card "Adicionar Nova Máquina" na `HomeSolicitante`. Não faz parte do Painel do Gestor.
- **Modal/Tela:** Envio de foto (área pontilhada) e campos primários. 
  - **Estratégia de Envio de Arquivo:** O envio da imagem da máquina DEVE ser feito utilizando o objeto nativo `FormData` multipart para eficiência, gerenciado de forma transparente pelo `api.ts`.
- **Campos Loja/Setor:** A Loja é travada automaticamente na loja do solicitante logado (`lojaId` em `useEstadoAutenticacao`) — o solicitante só cadastra máquinas na própria loja.
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
- **Abertura Automática de Solicitação ao Vencer (REGRA DE NEGÓCIO):** ao chegar (ou passar) a `proximaData` de uma preventiva **ativa**, o sistema abre automaticamente uma Solicitação de OS para o Gestor aprovar — sem exigir ação do Solicitante. Essa solicitação nasce com `origem: 'preventiva'` (`OrigemSolicitacao`, em `/src/tipos/ordemServico.ts`, junto a `preventivaId` referenciando a preventiva de origem) e aparece com **destaque visual** (`BadgeOrigemPreventiva`, borda/ícone em âmbar) tanto no card da listagem (`CardSolicitacaoGestor`) quanto no `ModalDetalhesSolicitacao`, para o Gestor diferenciar de pedidos abertos por um Solicitante. Em produção isso deve ser um job/cron no back-end; no mock atual, `gerarSolicitacoesPreventivasVencidas` (`/src/utilitarios/gerarSolicitacoesPreventivas.ts`) simula o comportamento comparando `proximaData` com a data atual sempre que `servicoSolicitacoes.listarTodas` é chamado (evitando duplicar solicitação para a mesma preventiva). `PREV-007` em `dadosMockPreventivas.ts` já nasce vencida para demonstrar o comportamento.

### 6. Painel do Gestor (`PainelGestor`)
- **Navegação:** Abas para `Solicitações`, `OS Finalizadas`, `Manutenção Prev.`.
- **Filtro por Loja e Setor Obrigatório:** Listagem separada visualmente em blocos por Loja (Ex: Cabeçalho divisor "Loja: Loja 2 - Filial Sul") e, dentro de cada bloco, subdividida por Setor caso o escopo do gestor não cubra a loja inteira (Ex: "Setor: Padaria"). Escopos com `setores: 'todos'` exibem a loja sem subdivisão por setor.
- **Ações por Solicitação:** Cada card de solicitação (`CardSolicitacaoGestor`) possui um botão de visualização (ícone de olho) que abre o `ModalDetalhesSolicitacao` — somente leitura, com máquina, loja, setor, solicitante, data/hora, status, descrição e os Marcadores de Impacto informados pelo Solicitante. Na aba `Solicitações`, o card também exibe o botão `Abrir OS`, que abre o `ModalAbrirOrdemServico` (ver item 10). Solicitações com `origem: 'preventiva'` recebem destaque visual (ver regra acima) para o Gestor identificá-las rapidamente.
- **Gestão de Setores e Lojas (Cadastro Dinâmico):** O Gestor tem, nas Ações Rápidas, botões para **cadastrar novos setores** e **novas lojas** diretamente pelo painel (`/cadastrar-setor`, `/cadastrar-loja`), mockados via `servicoSetores`/`servicoLojas` (setores podem se repetir entre lojas diferentes, cada um como um registro independente por loja). Os formulários existentes (`CadastrarMaquina`, `NovaSolicitacaoOS`, `CadastrarUsuario`) continuam validando `setor` contra a union estática `setoresDisponiveis`/`Setor` (`/src/tipos/maquina.ts`) — a troca desses `z.enum` para validar contra a lista dinâmica de setores cadastrados é um passo futuro ainda não implementado.
- **Ações Rápidas:** Botões superiores para `Cadastrar Usuário` (ver item 7), `Cadastrar Loja` e `Cadastrar Setor`.

### 7. Tela de Cadastro de Usuário (`CadastrarUsuario` - Gestor)
- **Acesso:** Ação rápida "Cadastrar Usuário" no Painel do Gestor. É onde o Gestor cria o login de Solicitantes, Técnicos e outros Gestores (não há tela de auto-cadastro).
- **Campos do Formulário (Validação Zod obrigatória):**
  - **Perfil (Role) \***: seletor `Solicitante` / `Técnico` / `Gestor` (reaproveita o `SeletorPerfil`, componente compartilhado usado também na Tela de Login).
  - **Nome \***, **E-mail \***, **Senha \***: campos padrão de identificação/acesso.
  - **Telefone**: opcional.
  - **Loja(s) \***: seleção entre as lojas cadastradas (`LOJAS_MOCK`). Solicitante vincula-se a **exatamente uma** loja (seleção única); Técnico e Gestor podem ser vinculados a **múltiplas lojas** (seleção múltipla).
  - **Setor(es)**: **não aparece para o perfil Técnico** — ele enxerga as OS em que for designado como responsável, independente de setor (ver Painel do Técnico, item 9). Para Solicitante é seleção **única** (o setor onde atua). Para Gestor é seleção **múltipla**, com uma alternância adicional **"Acesso total aos setores"** que, quando ativada, dispensa a seleção manual e equivale a `setores: 'todos'` (o mesmo conceito de `EscopoAcessoGestor` usado no Painel do Gestor) para todas as lojas selecionadas.
  - **Área de Atuação \***: aparece **somente para o perfil Técnico**, em substituição ao campo de Setor(es). Seleção única entre `areasTecnico` (`/src/tipos/tecnico.ts`: `Refrigeração`, `Elétrica`, `Mecânica`, `Hidráulica`, `Máquinas em Geral`). É essa área que aparece junto ao nome do técnico no seletor de "Técnico Responsável" do `ModalAbrirOrdemServico` (ver item 10).
- **Observação de Modelagem:** O mesmo conjunto de setores/acesso-total selecionado no formulário é aplicado a todas as lojas marcadas nesse cadastro — não há, ainda, configuração de setores distintos por loja dentro de um único cadastro (um Gestor com acesso parcial numa loja e total noutra exigiria editar o usuário depois).

### 8. Painel de Indicadores de Máquinas (`DashboardGestor`)
- **Acesso:** Ação rápida "Indicadores" no Painel do Gestor (`/dashboard-gestor`, `perfis={['gestor']}`).
- **Seletor Dinâmico:** Máquinas agrupadas por Loja e, dentro dela, por Setor, respeitando os escopos de acesso do Gestor — reaproveita `agruparPorEscopoGestor` (mesma função usada no Painel do Gestor, item 6) sobre a listagem completa de `useMaquinas()`.
- **Métricas (via React Query):** `useIndicadoresMaquina(maquinaId)` exibe Horas Parada, MTTR, MTBF e Custo Total da máquina selecionada, além de um gráfico de rosca (paradas por Tipo de Defeito, ver `tiposDefeito` no item 3) e um gráfico de barras mensais (Custo Total, últimos 6 meses).
- **Observação de Modelagem:** as métricas dependem de dados históricos de OS finalizada (datas, custo, tempo de reparo). O `ModalEncerrarOrdemServico` (item 11) já existe e grava esses dados (`dataInicio`, `dataFim`, `horaEstimada`, `custo`, `defeitoConstatado`, `causaRaiz`, `solucao`) na própria `OrdemServico` mockada, mas `servicoIndicadores`/`dadosMockIndicadores.ts` (`/src/tipos/indicadorMaquina.ts`) ainda geram indicadores mockados determinísticos por máquina, independentes desses dados — ligar `servicoIndicadores.obterPorMaquina` aos fechamentos reais de `ORDENS_SERVICO_MOCK` (e, no futuro, à API real) é um passo seguinte ainda não implementado.
- **Gráficos:** implementados como SVG/CSS local (`GraficoRosca`, `GraficoBarras` em `DashboardGestor/componentes/`), sem biblioteca de terceiros — consistente com a preferência do projeto por wrappers nativos em vez de dependências extras (ver `api.ts`). Paleta categórica fixa por identidade do tipo de defeito em `coresTipoDefeito.ts`.

### 9. Tela Principal do Técnico (`PainelTecnico`)
- **Acesso:** O login com perfil Técnico resolve um `tecnicoId` mockado (`obterTecnicoLogadoMock` em `dadosMockTecnicos.ts`, guardado em `useEstadoAutenticacao`) e redireciona para `/painel-tecnico` (`ROTA_POR_PERFIL`, rota protegida com `perfis={['tecnico']}`). Cada Técnico só visualiza as OS em que `tecnicoId` bate com o seu (`servicoOrdensServico.listarPorTecnico`) — nunca as de outro técnico.
- **Abas e Filtros:** `OS em Aberto` (padrão, reúne os status `Aberta` e `Em Andamento`), `Pendentes / Pausadas` (espera de peças) e `OS Concluídas`.
- **Agrupamento por Setor + Loja:** dentro de cada aba, as OS são separadas visualmente em blocos por combinação de Setor e Loja (ex: "Açougue - Loja 1", "Padaria - Loja 3"), via `agruparPorSetorLoja` (`/src/utilitarios/agruparPorSetorLoja.ts`) + `BlocoSetorLoja`. É um agrupamento só de organização visual (sem regra de controle de acesso, diferente do `agruparPorEscopoGestor` do Gestor), útil porque um mesmo Técnico pode atender múltiplas lojas (`lojasIds` em `Tecnico`, `/src/tipos/tecnico.ts`).
- **Ciclo de Vida da OS (`StatusExecucaoOS`):** `Aberta` → `Em Andamento` → `Concluída`, com `Pausada` acessível a partir de `Aberta` ou `Em Andamento` a qualquer momento:
  - **Aberta:** OS recém-atribuída pelo Gestor, ainda não iniciada. Card mostra `Pausar` e `Iniciar Atendimento` lado a lado.
  - **Iniciar Atendimento:** grava `dataInicio` automaticamente (`new Date()`) e move a OS para `Em Andamento`. Card passa a mostrar `Pausar` e `Finalizar OS` (destaque verde, abre o `ModalEncerrarOrdemServico`, item 11).
  - **Pausar:** abre `ModalPausarOrdemServico` (Zod + textarea obrigatória para o motivo, ex: "aguardando peça"). A OS guarda de qual status veio (`statusAntesDaPausa: 'Aberta' | 'Em Andamento'`) antes de virar `Pausada`, e exibe o motivo no card.
  - **Retomar Atendimento:** volta a OS para o status salvo em `statusAntesDaPausa` (ou `Em Andamento` se não houver) e limpa o motivo da pausa.
  - **Concluída:** somente leitura; o card exibe um botão de visualização (ícone de olho) que abre o `ModalDetalhesEncerramento`, mostrando os dados gravados pelo item 11.
- Toda essa movimentação de estado é mock-first, mutando `ORDENS_SERVICO_MOCK` diretamente via `servicoOrdensServico.ts` (`iniciar`/`pausar`/`retomar`/`encerrar`) — não há endpoint real para o domínio de execução de OS ainda, então (diferente de `criar`/`abrirOS` dos itens 3/10) essas ações não chamam `api.ts`, para manter o painel funcional de ponta a ponta sem backend.

### Modal de Pausa de OS (`ModalPausarOrdemServico` - Técnico)
- **Cabeçalho:** mesmo padrão dos demais modais — fundo verde escuro, "PAINEL DO TÉCNICO" em letras miúdas e "Pausar OS · #id" em destaque.
- **Campo:** `Motivo da Pausa *` (`textarea`, Zod obrigatório, ex: "Aguardando peça de reposição do fornecedor.").
- **Botões:** `Cancelar` (neutro) e `Pausar OS` (verde, com ícone).

### 10. Modal de Abertura de OS (`ModalAbrirOrdemServico` - Gestor)
- **Nível de Urgência:** Cards coloridos (Baixa/Média/Alta mapeado para `IdUrgencia`).
- **Campos de Controle:**
  - **Data/Hora:** Capturada automaticamente do navegador (`new Date()`) no momento da abertura da OS — não é um campo editável pelo Gestor, apenas exibida como confirmação.
  - **Técnico Responsável:** Select com os técnicos disponíveis para a loja da solicitação (`useTecnicos`/`servicoTecnicos`, filtrado por `lojasIds`), exibindo nome **e área de atuação** (ex: "Roberto Alves — Refrigeração"), definida no cadastro do técnico (ver item 7).
- Os **Marcadores de Impacto** (`Afeta Produção`, `Parada Parcial`, `Retrabalho`) **não** são preenchidos aqui — são informados pelo Solicitante na própria Nova Solicitação OS (ver item 3) e exibidos ao Gestor no `ModalDetalhesSolicitacao` (ver item 6).

### 11. Modal de Encerramento de OS (`ModalEncerrarOrdemServico` - Técnico)
- **Acesso:** abre a partir do botão `Finalizar OS` do card, disponível apenas quando a OS está `Em Andamento` (ver item 9).
- **Formulário de Execução:** Validação rígida Zod para campos críticos.
  - `dataInicio` / `dataFim` (período): **não são campos editáveis** — mesmo padrão de captura automática do item 10 (`Data/Hora` do `ModalAbrirOrdemServico`). `dataInicio` é o instante em que o Técnico clicou em "Iniciar Atendimento" (gravado na OS); `dataFim` é capturado (`new Date()`) na abertura do próprio modal. Ambos aparecem como confirmação somente leitura ("Início do Atendimento" / "Término do Atendimento").
  - `horaEstimada` / `custo` (financeiro) — campos numéricos validados via Zod.
  - Áreas de texto amplas: `defeitoConstatado`, `causaRaiz`, `solucao`.
- **Botões:** `Cancelar` (neutro) e `Encerrar OS` (verde, com ícone).
- Ao salvar, os dados ficam gravados na `OrdemServico` (mock, em `servicoOrdensServico.encerrar`) e ficam disponíveis para consulta posterior via `ModalDetalhesEncerramento` na aba `OS Concluídas` do Painel do Técnico — evitando que essa informação fique "perdida" depois do encerramento.
- **Desvio deliberado da regra geral de `api.ts`:** diferente dos itens 3/10 (que chamam `api.post` num endpoint real), o encerramento aqui é mock-first (mutação em memória), pelo mesmo motivo do restante do item 9 — ainda não existe backend real para o domínio de execução de OS, e usar `api.ts` quebraria a demonstração (a URL de homologação em `.env` não responde). Trocar para `api.ts` real é um passo futuro, junto com a virada do `servicoIndicadores` (item 8) para consumir esses fechamentos de verdade.