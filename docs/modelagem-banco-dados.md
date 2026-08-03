# Modelagem do Banco de Dados — Revisão pós-interface

Documento gerado a partir da revisão do código do front-end (`/src/tipos`, `/src/servicos`, `/src/paginas`)
comparado ao DER original desenhado antes da construção das telas.

O diagrama em si está em [`der-banco-dados.mmd`](./der-banco-dados.mmd) (Mermaid, pronto para colar
em <https://mermaid.live>).

---

## 1. O que mudou em relação ao DER original

### 1.1 Mudanças estruturais (alto impacto)

| # | Tema | DER original | O que a interface exige hoje |
|---|---|---|---|
| 1 | **Hierarquia organizacional** | `setor` pendurado direto no tenant. **Não existe `loja`.** | `Empresa (= tenant) > Loja > Setor`. Ver `/src/tipos/loja.ts`, `/src/tipos/empresa.ts`, `/src/tipos/setor.ts`. Todo o Painel do Gestor agrupa por Loja, e "Padaria" existe como registro independente em cada loja (`dadosMockSetores.ts`). |
| 2 | **Acesso do Gestor** | `login.IdSetor` — **um único setor por usuário**. | `EscopoAcessoGestor[]` (`/src/tipos/autenticacao.ts`): lista de escopos, cada um = 1 loja + (lista de setores **ou** `'todos'`). Um gestor cobre várias lojas simultaneamente. Impossível representar com uma FK única. |
| 3 | **Técnico ↔ Loja** | Sem vínculo entre técnico e loja. | `Tecnico.lojasIds: string[]` (`/src/tipos/tecnico.ts`). O `ModalAbrirOrdemServico` filtra técnicos pela loja da solicitação. Relação N:N. |
| 4 | **Marcadores de Impacto** | Colunas `afetaProducao` / `paradaParcial` / `retrabalho` em **`ordem de serviço`**. | Migraram para a **solicitação** — são preenchidos pelo Solicitante ao abrir o pedido, e o Gestor apenas visualiza (CLAUDE.md itens 3, 6 e 10). Ver `SolicitacaoOS.impactos`. |
| 5 | **Ciclo de vida da OS** | `ordem de serviço.idStatus` apontando para uma tabela `status` genérica. | Máquina de estados própria: `Aberta → Em Andamento → Concluída`, com `Pausada` acessível a partir das duas primeiras, mais `motivoPausa`, `statusAntesDaPausa` e `dataInicio` (`/src/tipos/ordemServico.ts`). |
| 6 | **Origem da solicitação** | Não existe. | `origem: 'solicitante' \| 'preventiva'` + `preventivaId`. Preventiva vencida abre solicitação automaticamente (`gerarSolicitacoesPreventivas.ts`). |
| 7 | **Cadastro de usuário** | `login` + `Tecnico` (com `idLogin`) + `funcao` como tabelas separadas. | Cadastro único (`NovoUsuarioPayload`): nome, e-mail, senha, telefone, role, lojas, setores, acesso total e área de atuação — tudo numa tela só (`CadastrarUsuario`). |

### 1.2 O que se manteve fiel ao DER original

- `maquina` (tag, nome, marca, modelo, descrição, fotoUrl, criticidade) — praticamente idêntica.
- `Manutencao_preventiva` (descrição, intervalo, próxima data, ativo, máquina).
- `finalizar OS` → todos os campos previstos (`dataInicio`, `dataFim`, `horaEstimada`, `custo`,
  `defeitoConstatado`, `causaRaiz`, `solucao`) foram implementados no item 11 exatamente como projetados.
- Tabelas de apoio `criticidade`, `urgencia`, `defeito`, `status` — o conceito se manteve.
- `tenantId` presente em todas as entidades de negócio.

---

## 2. Boas práticas aplicadas na nova modelagem

### 2.0 `empresa` **é** o tenant (decisão tomada)
Não existe tabela `tenant` separada. **`empresa` é a raiz multi-tenant**: um cliente SaaS =
uma empresa = um subdomínio. A coluna `empresa.subdominio` (UNIQUE) é o que o `api.ts` extrai de
`window.location.hostname` e envia no header `X-tenant-ID`.

Todas as demais tabelas de negócio carregam a FK **`tenant_id` → `empresa.id`**. O nome da coluna
é `tenant_id` (e não `empresa_id`) de propósito: deixa explícito que aquilo é o discriminador de
isolamento multi-tenant, que é o papel que a coluna cumpre nas policies de RLS — e casa com o
`tenantId` já usado no front-end e no DER original.

> Consequência prática: `loja` tem **apenas** `tenant_id`. Não existe mais `loja.empresa_id`,
> porque seria a mesma coluna com dois nomes.

Nas tabelas mais profundas (`maquina`, `solicitacao_os`, `ordem_servico`, …) o `tenant_id` é
**tecnicamente derivável** por join até a loja. Ele é mantido de forma denormalizada de propósito,
por dois motivos: permite que a policy de RLS filtre sem join, e transforma o isolamento entre
clientes em algo que o banco garante em cada tabela — não em algo que depende do `WHERE` correto
na aplicação. O preço é a necessidade de garantir a coerência (ver seção 3).

### 2.1 Tabela `status` genérica foi dividida
No DER original, uma única tabela `status` era compartilhada por `solicitacaoOrdemServico`,
`ordem de serviço` e `finalizar OS`. Isso é o anti-padrão *"one true lookup table"*: nada impede
gravar numa OS um status que só faz sentido para uma solicitação.

**Agora:** `status_solicitacao` (Pendente/Convertida/Rejeitada) e `status_os`
(Aberta/Em Andamento/Pausada/Concluída) são tabelas distintas, cada uma com sua FK.
`finalizar OS.idStatus` foi **removido** — é redundante: se existe registro de encerramento,
a OS está concluída.

### 2.2 Pausa virou histórico, não campo sobrescrito
`motivoPausa` + `statusAntesDaPausa` como colunas da OS perdem o histórico: se o técnico pausa
três vezes, só a última sobrevive.

**Agora:** tabela `os_pausa` (`motivo`, `pausada_em`, `retomada_em`, `status_anterior_id`).
Além de preservar o histórico, isso é o que torna possível calcular **MTTR e horas de parada
corretamente** (descontando o tempo pausado) no Painel de Indicadores (item 8 do CLAUDE.md) —
hoje esses números são gerados por mock.

### 2.3 Máquina referencia apenas `setor_id`
O front-end carrega `lojaId` **e** `setor` na máquina. Como setor já pertence a uma loja,
guardar as duas FKs permite estado contraditório (máquina cujo `loja_id` não bate com o
`setor.loja_id`).

**Agora:** `maquina.setor_id` apenas; a loja vem por join. Se a performance exigir, o `loja_id`
pode ser desnormalizado depois, mas aí com FK composta `(loja_id, setor_id)` referenciando
`setor(loja_id, id)` para o banco garantir a coerência.

### 2.4 `data_inicio` não é duplicado no encerramento
No front-end, `dataInicio` é gravado ao clicar em "Iniciar Atendimento" e depois **regravado**
no encerramento. Duas fontes para o mesmo fato = risco de divergência.

**Agora:** `ordem_servico.iniciada_em` é a única fonte; `os_encerramento` guarda só `data_fim`.

### 2.5 Escopo de acesso unificado para os três perfis
`usuario_escopo` (usuário + loja + `acesso_total_setores`) + `usuario_escopo_setor` cobre os três
perfis com a mesma estrutura:

- **Solicitante:** 1 escopo, `acesso_total = false`, exatamente 1 setor.
- **Técnico:** N escopos com `acesso_total = true` (ele enxerga por designação na OS, não por setor).
- **Gestor:** N escopos, cada um com `acesso_total` ou uma lista de setores.

> Bônus: este modelo já resolve a limitação registrada no CLAUDE.md item 7 — "um Gestor com acesso
> parcial numa loja e total noutra exigiria editar o usuário depois". No banco isso passa a ser
> natural; só o formulário é que ainda não expõe.

### 2.6 Marcadores de impacto como N:N
Em vez de três colunas booleanas (`afetaProducao`, `paradaParcial`, `retrabalho`), uma tabela
`marcador_impacto` + associativa `solicitacao_impacto`. Adicionar um 4º marcador vira `INSERT`,
não `ALTER TABLE`. Casa com o formato de array já usado no front (`impactos: MarcadorImpacto[]`).

### 2.7 Convenções gerais
- **Nomenclatura:** `snake_case`, tabelas no singular, em Português-BR (consistente com a regra
  de idioma do projeto).
- **PKs:** `uuid` nas entidades de negócio (evita enumeração de IDs entre tenants em uma API pública);
  `smallint` nas tabelas de domínio/lookup, que são pequenas e estáveis.
- **Datas:** `timestamptz` (nunca `timestamp` sem fuso); `date` só onde não há hora (`preventiva.proxima_data`).
- **Dinheiro:** `numeric(12,2)` — nunca `float`/`real`.
- **Senha:** `senha_hash` (bcrypt/argon2). O DER original tinha `login.senha`, o que sugeria texto puro.
- **Auditoria:** `criado_em` em todas as tabelas; `atualizado_em` via trigger onde houver edição.
- **Soft delete:** flags `ativo`/`ativa` preservadas onde o DER já previa, para não perder histórico de OS.

---

## 3. Constraints que o banco deve garantir

Regras de negócio que hoje só existem em Zod no front-end e **precisam** ser replicadas no banco:

```sql
-- Área de atuação é obrigatória para técnico e proibida para os demais perfis
ALTER TABLE usuario ADD CONSTRAINT ck_usuario_area_tecnico
  CHECK ((perfil_id = (SELECT id FROM perfil_usuario WHERE codigo = 'tecnico'))
         = (area_tecnico_id IS NOT NULL));
-- (na prática, resolver via ENUM de perfil ou trigger, já que CHECK não aceita subquery)

-- Coerência da origem da solicitação
ALTER TABLE solicitacao_os ADD CONSTRAINT ck_origem_preventiva
  CHECK ((origem = 'preventiva') = (preventiva_id IS NOT NULL));
ALTER TABLE solicitacao_os ADD CONSTRAINT ck_origem_solicitante
  CHECK ((origem = 'solicitante') = (solicitante_id IS NOT NULL));

-- Uma solicitação vira no máximo uma OS
ALTER TABLE ordem_servico ADD CONSTRAINT uq_os_solicitacao UNIQUE (solicitacao_id);

-- Uma OS tem no máximo um encerramento
ALTER TABLE os_encerramento ADD CONSTRAINT uq_encerramento_os UNIQUE (ordem_servico_id);

-- Setor único por loja (mas "Padaria" pode repetir entre lojas diferentes)
ALTER TABLE setor ADD CONSTRAINT uq_setor_loja UNIQUE (loja_id, nome);

-- Tag de máquina única por tenant
ALTER TABLE maquina ADD CONSTRAINT uq_maquina_tag UNIQUE (tenant_id, tag);

-- E-mail único por tenant (o mesmo e-mail pode existir em tenants diferentes)
ALTER TABLE usuario ADD CONSTRAINT uq_usuario_email UNIQUE (tenant_id, email);

-- Uma preventiva não pode ter duas solicitações pendentes ao mesmo tempo
-- (mas PODE gerar várias ao longo do tempo, a cada ciclo de intervalo_dias)
CREATE UNIQUE INDEX uq_preventiva_pendente ON solicitacao_os (preventiva_id)
  WHERE preventiva_id IS NOT NULL AND status_id = 1; -- 1 = Pendente

-- Uma OS não pode ter duas pausas abertas simultaneamente
CREATE UNIQUE INDEX uq_pausa_aberta ON os_pausa (ordem_servico_id)
  WHERE retomada_em IS NULL;

-- Coerência temporal e financeira do encerramento
ALTER TABLE os_encerramento ADD CONSTRAINT ck_encerramento_valores
  CHECK (custo >= 0 AND horas_trabalhadas > 0);
ALTER TABLE preventiva ADD CONSTRAINT ck_intervalo CHECK (intervalo_dias > 0);
```

### Coerência do `tenant_id` denormalizado

Como `tenant_id` se repete nas tabelas profundas (seção 2.0), o banco precisa impedir que uma
máquina do tenant A aponte para um setor do tenant B. A forma de resolver isso **sem trigger** é
usar chaves compostas: declara-se um `UNIQUE (tenant_id, id)` no pai e a FK filha referencia o par.

```sql
-- Pai expõe o par (tenant_id, id)
ALTER TABLE loja  ADD CONSTRAINT uq_loja_tenant  UNIQUE (tenant_id, id);
ALTER TABLE setor ADD CONSTRAINT uq_setor_tenant UNIQUE (tenant_id, id);

-- Filha referencia o par: o tenant passa a ser verificado pelo próprio FK
ALTER TABLE setor ADD CONSTRAINT fk_setor_loja
  FOREIGN KEY (tenant_id, loja_id) REFERENCES loja (tenant_id, id);

ALTER TABLE maquina ADD CONSTRAINT fk_maquina_setor
  FOREIGN KEY (tenant_id, setor_id) REFERENCES setor (tenant_id, id);
```

O mesmo padrão vale para `solicitacao_os → maquina`, `ordem_servico → solicitacao_os` e
`os_encerramento → ordem_servico`. É o que torna o vazamento entre tenants **estruturalmente
impossível**, em vez de depender de disciplina no código.

**Índices recomendados:** todas as FKs, mais `(tenant_id, status_id)` em `solicitacao_os` e
`ordem_servico`, e `(tecnico_id, status_id)` em `ordem_servico` — que é exatamente a consulta do
Painel do Técnico.

**Isolamento multi-tenant:** com `tenant_id` presente nas tabelas de negócio, o caminho recomendado
no PostgreSQL é **Row Level Security (RLS)** com uma policy por tabela usando
`current_setting('app.tenant_id')`, garantindo o isolamento no banco e não só na aplicação.

---

## 4. Pontos em aberto (decisões que dependem de você)

> **Resolvido:** `empresa` **é** o tenant — tabela única, raiz do modelo, com as demais
> referenciando-a por `tenant_id`. Ver seção 2.0.

1. **Tabelas de domínio vs. ENUM.**
   Modelei `tipo_defeito`, `nivel_urgencia`, `nivel_criticidade`, `status_*` e `marcador_impacto`
   como tabelas de lookup (seguindo o DER original). Hoje o front trata todos como `z.enum` fixos —
   se nunca forem editáveis pelo usuário, `ENUM` nativo do Postgres ou `CHECK` seria mais simples e
   rápido. Tabela só se ganha se o cliente puder cadastrar novos valores.

2. **`setor` dinâmico vs. enum estático.**
   O banco já modela setor como tabela (correto). Mas o front ainda valida `setor` contra a união
   estática `setoresDisponiveis` (pendência já registrada no CLAUDE.md item 6). Ao integrar com o
   back-end real, esses `z.enum` precisam passar a consumir `servicoSetores.listar()`.

3. **Histórico de status da OS.**
   Modelei apenas o status atual + histórico de pausas. Se for necessário auditar toda a transição
   (quem mudou de Aberta para Em Andamento, quando), vale uma tabela `os_evento`
   (`ordem_servico_id`, `status_anterior_id`, `status_novo_id`, `usuario_id`, `ocorrido_em`) —
   aí `os_pausa` até poderia ser derivada dela.
