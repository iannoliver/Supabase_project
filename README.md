# Pulse Commerce

Aplicacao full stack desenvolvida com Next.js, Supabase e Mercado Pago, composta por uma area administrativa protegida, um catalogo publico e um fluxo de compra com carrinho, checkout e atualizacao de pedidos por webhook.

O objetivo do projeto e demonstrar uma base moderna e pronta para evolucao, com foco em separacao de responsabilidades, seguranca, clareza de codigo e experiencia consistente tanto para o usuario final quanto para a operacao administrativa.

## Visao geral

O sistema entrega tres frentes principais:

- painel administrativo com autenticacao, autorizacao por perfil e gestao operacional
- vitrine publica para navegacao de produtos e descoberta comercial
- fluxo de compra com criacao de pedido antes do pagamento e integracao com Mercado Pago Checkout Pro

Contexto de uso:

- area publica: home, catalogo, detalhe de produto, carrinho e checkout
- area administrativa: dashboard, usuarios, produtos e pedidos
- pagamentos: redirecionamento para Mercado Pago e confirmacao final por webhook

## O que o projeto entrega

### Autenticacao e sessao

- login com Supabase Auth
- sessao SSR com helpers separados para browser, server e middleware
- logout funcional
- protecao de rotas privadas com middleware
- redirecionamentos para login e bloqueio de acessos indevidos

### Painel administrativo

- dashboard protegido
- cards de resumo com metricas operacionais
- gestao de usuarios
- edicao de nome e role
- CRUD de produtos com filtros, validacoes e feedback visual
- area administrativa de pedidos

### Catalogo publico

- home publica com hero e secao de destaques
- listagem de produtos ativos via API interna do Next.js
- pagina de detalhe por slug
- cards reutilizaveis
- fallback visual para falha de imagens externas

### Carrinho, checkout e pedidos

- carrinho em `localStorage`
- alteracao de quantidade e remocao de itens
- checkout com React Hook Form + Zod
- criacao de pedido antes do redirecionamento para pagamento
- integracao com Mercado Pago Checkout Pro
- paginas de retorno para sucesso, pendencia e falha
- atualizacao do status do pedido por webhook

## Stack utilizada

- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- Supabase
- Supabase Auth SSR com `@supabase/ssr`
- React Hook Form
- Zod
- `@hookform/resolvers`
- TanStack Query
- Sonner
- Lucide React
- Mercado Pago Checkout Pro

## Arquitetura resumida

### Separacao entre publico e admin

O projeto usa App Router com separacao clara entre:

- area publica em `app/(public)`
- area administrativa em `app/admin`
- rotas de autenticacao em `app/login`
- APIs internas em `app/api`

### API interna como camada de acesso

As paginas publicas nao acessam o banco diretamente para listar produtos. O consumo acontece por APIs internas do Next.js, principalmente:

- `GET /api/products/public`
- `GET /api/products/public/[slug]`

Isso ajuda a centralizar regras de exposicao de dados e manter a area publica desacoplada do banco.

### Supabase como auth + banco + RLS

O Supabase e usado para:

- autenticacao
- persistencia de dados
- Row Level Security
- modelagem de perfis e permissoes

As permissoes sao reforcadas no banco e no servidor.

### Pagamento no backend

O checkout com Mercado Pago foi implementado com foco em seguranca:

- o frontend nunca cria preferencia diretamente
- o pedido e criado primeiro no banco
- preco e estoque sao validados no backend
- a preferencia e criada no servidor
- o webhook e a fonte de verdade para status final

### Fluxo de pedido

1. Usuario adiciona itens ao carrinho.
2. O checkout envia dados basicos e itens para `POST /api/checkout/create-preference`.
3. O servidor valida o payload, busca os produtos reais no banco, recalcula valores e valida estoque.
4. O pedido e criado em `orders` e os itens em `order_items`.
5. O backend cria a preferencia no Mercado Pago.
6. O usuario e redirecionado para o Checkout Pro.
7. O retorno de front nao aprova o pedido sozinho.
8. O webhook consulta o pagamento e atualiza o pedido com base no status real.

## Funcionalidades

### Admin

- login
- dashboard protegido
- listagem e edicao de usuarios
- controle de acesso por role
- CRUD de produtos
- filtros simples de produtos
- visualizacao administrativa de pedidos

### Publico

- home com destaque comercial
- catalogo publico
- detalhe de produto por slug
- exibicao apenas de produtos ativos
- fallback de imagem para falhas externas

### Checkout e pagamentos

- carrinho com persistencia local
- resumo de pedido
- formulario de checkout com validacao
- criacao de preferencia no backend
- redirecionamento para Mercado Pago Checkout Pro
- paginas de retorno
- webhook para atualizacao de status

### Seguranca e permissoes

- roles `admin` e `editor`
- middleware protegendo `/admin`
- checagem de role no servidor
- `/admin/usuarios` restrito a `admin`
- `service_role` usada apenas no servidor
- webhook validado por assinatura

## Como rodar o projeto localmente

### 1. Clonar o repositorio

```bash
git clone <url-do-repositorio>
cd supabase_project2
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Criar o arquivo de ambiente

Crie um `.env.local` com base em `.env.example`:

```bash
cp .env.example .env.local
```

Se estiver no Windows e preferir manualmente, basta copiar o conteudo de `.env.example` para `.env.local`.

### 4. Preencher as variaveis de ambiente

Preencha as chaves reais do Supabase e do Mercado Pago no `.env.local`.

### 5. Executar os SQLs no Supabase

Abra o SQL Editor do Supabase e rode os arquivos na ordem indicada na secao "Configuracao do Supabase".

### 6. Iniciar o projeto

```bash
npm run dev
```

Aplicacao local:

```text
http://localhost:3000
```

## Variaveis de ambiente

O projeto depende das seguintes envs:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MERCADO_PAGO_ACCESS_TOKEN=
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=
MERCADO_PAGO_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
```

### Uso de cada variavel

#### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`
  - URL publica do projeto no Supabase
  - usada no browser, server e middleware por meio dos clientes apropriados

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - chave anonima publica
  - usada nos clientes SSR e browser

- `SUPABASE_SERVICE_ROLE_KEY`
  - uso exclusivo no servidor
  - aplicada apenas em operacoes sensiveis via server-side

#### Mercado Pago

- `MERCADO_PAGO_ACCESS_TOKEN`
  - uso exclusivo no servidor
  - autentica chamadas backend para criacao de preferencia e consulta de pagamento

- `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY`
  - pode ser exposta ao frontend
  - mantida no projeto para evolucoes futuras da integracao

- `MERCADO_PAGO_WEBHOOK_SECRET`
  - uso exclusivo no servidor
  - valida a assinatura das notificacoes Webhook

- `NEXT_PUBLIC_APP_URL`
  - base para montagem de `back_urls` e `notification_url`
  - deve ser uma URL absoluta valida, por exemplo:
  - `http://localhost:3000`

### Backend-only x frontend

Backend-only:

- `SUPABASE_SERVICE_ROLE_KEY`
- `MERCADO_PAGO_ACCESS_TOKEN`
- `MERCADO_PAGO_WEBHOOK_SECRET`

Podem existir no frontend:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY`
- `NEXT_PUBLIC_APP_URL`

## Configuracao do Supabase

### SQLs e ordem de execucao

Execute os arquivos abaixo no SQL Editor do Supabase:

1. `supabase/sql/01_schema.sql`
2. `supabase/sql/02_rls_policies.sql`
3. `supabase/sql/03_seed_optional.sql` opcional
4. `supabase/sql/04_orders_checkout_mercadopago.sql`
5. `supabase/sql/05_orders_seed_optional.sql` opcional
6. `supabase/sql/06_update_product_images_optional.sql` opcional para bases ja populadas

### O que cada SQL faz

- `01_schema.sql`
  - cria `profiles` e `products`
  - cria funcao/gatilho de `updated_at`
  - cria indices base

- `02_rls_policies.sql`
  - ativa RLS
  - cria policies para perfis, produtos e operacao administrativa

- `03_seed_optional.sql`
  - insere produtos de exemplo

- `04_orders_checkout_mercadopago.sql`
  - cria `orders` e `order_items`
  - adiciona campos auxiliares de integracao com Mercado Pago
  - cria funcao para aplicar estoque quando pedido for aprovado
  - configura RLS e indices da camada de pedidos

- `05_orders_seed_optional.sql`
  - dados opcionais para testes de pedidos

- `06_update_product_images_optional.sql`
  - corrige URLs de imagens dos produtos seeded em bases ja existentes

### Como criar o primeiro usuario

1. Acesse `/login`.
2. Crie um usuario pelo fluxo configurado no Supabase Auth ou pela interface do Supabase.
3. Garanta que o registro correspondente exista em `public.profiles`.

### Como promover um usuario para admin

Execute no SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'seu-email@dominio.com';
```

### Como verificar os dados principais

Consultas uteis:

```sql
select * from public.profiles order by created_at desc;
select * from public.products order by created_at desc;
select * from public.orders order by created_at desc;
select * from public.order_items order by created_at desc;
```

## Configuracao do Mercado Pago

### Credenciais

Para este projeto, a integracao foi pensada para ambiente de teste.

Voce vai precisar de:

- Public Key
- Access Token
- Webhook Secret

### Diferenca entre Public Key e Access Token

- Public Key
  - chave publica
  - pode existir no frontend
  - usada para cenarios publicos da integracao

- Access Token
  - segredo do backend
  - usado para criar preferencias e consultar pagamentos
  - nunca deve ir para client component

### Como configurar o webhook

A preferencia e criada com `notification_url` apontando para:

```text
<NEXT_PUBLIC_APP_URL>/api/payments/mercadopago/webhook?source_news=webhooks
```

Pontos importantes:

- o projeto processa Webhook moderno com assinatura
- notificacoes IPN/legadas `topic/id` sao ignoradas com `200`
- o status do pedido deve ser confiado ao webhook, nao apenas ao retorno visual do checkout

### Ambiente local

Em desenvolvimento local, o webhook precisa de URL publica.

Exemplo de estrategia:

- subir a aplicacao em `http://localhost:3000`
- expor essa porta com um tunel temporario
- usar a URL publica gerada no `NEXT_PUBLIC_APP_URL`

Observacao:

- dependendo da ferramenta de tunel usada, pode existir uma tela intermediaria antes do redirecionamento ou do callback

## Como testar o projeto

### Roteiro pratico de avaliacao

1. Configure `.env.local`.
2. Execute os SQLs.
3. Promova um usuario para `admin`.
4. Rode `npm install`.
5. Rode `npm run dev`.
6. Acesse a home publica.
7. Navegue pelo catalogo em `/produtos`.
8. Abra um detalhe de produto.
9. Adicione itens ao carrinho.
10. Va para `/carrinho`.
11. Siga para `/checkout`.
12. Preencha nome e e-mail.
13. Gere o pagamento.
14. Complete ou simule o fluxo no Mercado Pago.
15. Confira:
    - pagina de retorno
    - registro em `orders`
    - itens em `order_items`
    - atualizacao do pedido no admin

### O que validar no fluxo

- produtos publicos aparecem apenas quando ativos
- carrinho persiste ao navegar
- checkout cria pedido antes do pagamento
- webhook atualiza o status do pedido
- estoque so e abatido quando o pagamento e aprovado
- admin ve usuarios, produtos e pedidos de acordo com a role

## Rotas principais

### Rotas publicas

- `/`
- `/produtos`
- `/produtos/[slug]`
- `/carrinho`
- `/checkout`
- `/checkout/sucesso`
- `/checkout/pendente`
- `/checkout/falha`
- `/login`

### Rotas administrativas

- `/admin`
- `/admin/produtos`
- `/admin/produtos/novo`
- `/admin/produtos/[id]`
- `/admin/usuarios`
- `/admin/usuarios/[id]`
- `/admin/pedidos`
- `/admin/pedidos/[id]`

### APIs principais

- `GET /api/products/public`
- `GET /api/products/public/[slug]`
- `GET /api/orders/[id]`
- `POST /api/checkout/create-preference`
- `POST /api/payments/mercadopago/webhook`
- `GET /api/admin/metrics`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PATCH /api/admin/products/[id]`
- `DELETE /api/admin/products/[id]`
- `GET /api/admin/users`
- `PATCH /api/admin/users/[id]`

## Seguranca e autorizacao

### Roles

- `admin`
  - dashboard
  - usuarios
  - produtos
  - pedidos

- `editor`
  - dashboard
  - produtos
  - sem acesso a usuarios
  - pedidos restritos a `admin` nesta fase

### Protecao aplicada

- middleware protege a area `/admin`
- checagem de role tambem acontece no servidor
- RLS ativa nas tabelas principais
- `service_role` restrita ao backend
- webhook validado por assinatura
- preco e estoque nunca sao confiados ao frontend no checkout

## Limitacoes e observacoes

- a integracao de pagamento foi pensada para ambiente de teste nesta entrega
- ambiente local depende de URL publica para webhook
- o carrinho e local ao navegador, sem sincronizacao entre dispositivos
- imagens externas dependem da disponibilidade do provedor remoto
- ferramentas de tunel podem introduzir telas ou redirecionamentos intermediarios

## Diferenciais tecnicos

- pedido criado antes do pagamento
- webhook como fonte de verdade para status final
- validacao server-side de preco, disponibilidade e estoque
- decremento de estoque apenas quando o pagamento e aprovado
- separacao de envs por contexto
- protecao de rotas com middleware e checagem adicional no servidor
- area publica consumindo API interna do Next.js em vez de acessar o banco diretamente
- tratamento de notificacoes legadas do Mercado Pago sem derrubar o endpoint

## Entrega para avaliacao

Se eu estivesse apresentando este projeto em um processo seletivo, eu sugeriria o seguinte roteiro de avaliacao:

1. rodar o projeto localmente com Supabase e Mercado Pago configurados
2. testar primeiro a area publica e o fluxo de checkout
3. validar o painel admin com um usuario `admin`
4. observar a separacao entre frontend publico, admin e APIs internas
5. revisar a organizacao de `lib`, `components`, `app/api` e `supabase/sql`

Fluxos que mais valem a pena testar primeiro:

- login e protecao do admin
- CRUD de produtos
- navegacao no catalogo publico
- carrinho e checkout
- atualizacao de pedido por webhook

O projeto foi estruturado para favorecer clareza de leitura, manutencao e evolucao incremental, sem depender de regras de negocio escondidas no frontend.

## Observacao final

Neste workspace, a validacao final continua dependendo do ambiente local completo, das envs reais e da configuracao ativa do Supabase e do Mercado Pago. A documentacao acima foi alinhada ao estado atual do projeto implementado.
