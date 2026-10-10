# Menu Zap — guia para novos desenvolvedores

Atualizado em **10 de outubro de 2026**, a partir do código e das configurações do repositório.

Este documento explica como executar o projeto, encontrar as funcionalidades e alterar o código respeitando os contratos e as permissões existentes. Para execução rápida, consulte o [README](README.md); para publicação, backups e restauração, use o [guia operacional](deploy/README.md).

## 1. O que o projeto faz hoje

Menu Zap é um cardápio digital com dois públicos:

- **Proprietário do estabelecimento:** cria uma conta e sua empresa, gerencia perfil, categorias, produtos e imagens, recebe pedidos e altera seus status.
- **Visitante:** acessa o catálogo público, monta o carrinho e envia um pedido sem criar uma conta.

Dashboard e relatórios usam pedidos persistidos. O relatório permite filtrar finalizados ou cancelados e imprimir pelo navegador. A página pública de pedidos exibe a confirmação do envio e seu identificador; não oferece histórico nem acompanhamento de status ao visitante.

A página de planos e o checkout são **demonstrativos**. O checkout cadastra usuário e empresa, mas não cobra, não persiste dados de cartão e não controla assinaturas ou períodos de teste no backend.

O backend versionado é Parse Server próprio com PostgreSQL. Uma instalação nova começa sem contas ou catálogo; não existe migração automática de dados do Back4App nem usuário de teste criado automaticamente.

## 2. Primeiro acesso ao ambiente local

### Executar tudo no Docker

Requisitos: Docker Engine, Docker Compose e máquina **amd64**, arquitetura da imagem PostGIS fixada no projeto.

Na raiz do repositório:

```bash
docker compose -f compose.local.yaml up -d --build --wait
```

Abra **http://localhost:8080**. O Compose local fornece as configurações de desenvolvimento e compila o frontend; não precisa de Node/npm no host ou de arquivos `.env` para esse modo.

Para conhecer o fluxo completo:

1. Acesse `/register` e cadastre um proprietário com senha de 10 a 128 caracteres.
2. Preencha os dados da empresa em `/profile`.
3. Crie uma categoria em `/categoria` e um produto dentro dela.
4. Abra `/{subdominio}/menu` em uma janela anônima. O subdomínio inicial deriva do nome de usuário, em minúsculas e sem acentos.
5. Adicione o produto ao carrinho e envie um pedido.
6. No painel do proprietário, abra `/pedidos/admin` e altere o status.

O campo chamado `subdominio` é um **segmento da URL**, como `/minha-loja/menu`; não requer configurar `minha-loja.exemplo.com` no DNS.

```bash
# Consultar saúde e logs
docker compose -f compose.local.yaml ps
docker compose -f compose.local.yaml logs -f backend

# Parar preservando os dados
docker compose -f compose.local.yaml down
```

Banco e imagens ficam em volumes. `down -v` apaga esses volumes e seus dados. O ambiente serve um build estático: após editar o código, repita `up -d --build --wait` para atualizar os containers.

Se a porta estiver ocupada:

```bash
MENUZAP_LOCAL_PORT=8081 docker compose -f compose.local.yaml up -d --build --wait
```

Acesse `http://localhost:8081` e mantenha essa variável nos comandos seguintes. Use `compose.local.yaml` sozinho; ele tem configuração e volumes próprios, separados do projeto Compose de produção.

### Desenvolver o frontend com recarregamento automático

Mantenha a stack local acima em execução. Instale **Node.js 24** conforme `.nvmrc`; os Dockerfiles usam 24.14.1, e o backend exige uma versão 24 igual ou superior a 24.11. As dependências do frontend e do backend têm `package.json` e lockfiles separados.

Crie `.env.local` na raiz com as chaves públicas do Compose local:

```dotenv
VITE_PARSE_APPLICATION_ID=menuzap-local
VITE_PARSE_JAVASCRIPT_KEY=menuzap-local-public-key
VITE_PARSE_SERVER_URL=http://localhost:8080/parse
```

```bash
npm ci
npm run dev
```

Abra **http://localhost:5173**. O Vite entrega o frontend e o navegador acessa a API pelo Caddy em `localhost:8080`. Se mudou a porta da stack, ajuste a URL acima. Reinicie o Vite após alterar variáveis de ambiente.

As variáveis `VITE_*` são públicas e entram no bundle. Nunca coloque a master key nelas. O build Docker recebe suas variáveis do Compose, não do `.env.local` do host.

### Trabalhar no backend

Para instalar dependências e executar os testes unitários:

```bash
npm ci --prefix backend
npm test --prefix backend
```

Para aplicar alterações do backend ao ambiente local:

```bash
docker compose -f compose.local.yaml up -d --build --wait backend
```

Não há montagem do código nem reinício automático por alteração de arquivo nesse Compose. O PostgreSQL também não publica a porta 5432 no host. Para executar a API diretamente com `npm start --prefix backend`, prepare um PostgreSQL acessível ao processo e configure as variáveis descritas em [deploy/README.md](deploy/README.md#desenvolvimento-local).

## 3. Arquitetura e tecnologias

```mermaid
flowchart LR
    Browser["Navegador: React + SDK Parse"] -->|"HTML, CSS e JS"| Web["Caddy"]
    Browser -->|"Requisições /parse"| Web
    Web -->|"Proxy /parse"| API["Express + Parse Server + Cloud Code"]
    API --> DB[("PostgreSQL / PostGIS")]
    API --> Files["Volume de imagens"]
```

O frontend usa o SDK Parse para autenticação, consultas, gravações e arquivos. O PostgreSQL é acessado pelo servidor; as classes e os ponteiros continuam seguindo o modelo Parse. As regras de negócio críticas ficam no Cloud Code, executado antes das gravações.

| Camada | Implementação atual |
|---|---|
| Frontend | React 19, TypeScript 7 em modo estrito e Vite 8 |
| Rotas | React Router 7, `BrowserRouter`, `Routes`, `Outlet` e páginas carregadas com `lazy` |
| Interface | Material UI 9 e Emotion; Bootstrap/CSS e scripts locais de jQuery na página inicial |
| Gráficos e CEP | Recharts e `cep-promise` |
| Integração | Parse SDK 8.6; inicializado uma vez antes de renderizar o React |
| Backend | Node 24, Express 5 e Parse Server 9.10; JavaScript CommonJS |
| Persistência | PostgreSQL 17/PostGIS 3.5 e `@parse/fs-files-adapter` 3 |
| Infraestrutura | Docker Compose, Caddy 2.10.2 e imagens fixadas por digest |
| Testes | Vitest/Testing Library no frontend; `node:test` e PostgreSQL real na integração |

As versões e scripts de referência estão em [package.json](package.json), [backend/package.json](backend/package.json) e nos respectivos lockfiles. O projeto usa npm; os dois diretórios de dependências são instalados separadamente, sem npm workspaces.

## 4. Onde encontrar o código

| Caminho | Responsabilidade |
|---|---|
| [src/main.tsx](src/main.tsx) e [src/App.tsx](src/App.tsx) | Inicialização do Parse, montagem do React e entrada das rotas |
| [src/routes.tsx](src/routes.tsx) | Todas as rotas e o `CartProvider` das páginas públicas |
| [src/routes/PrivateRoute.tsx](src/routes/PrivateRoute.tsx) | Redirecionamento ao login quando não há sessão autenticada |
| `src/pages/admin/` | Dashboard, perfil, catálogo, pedidos e relatórios |
| `src/pages/client/` | Cardápio, detalhes, carrinho, envio e confirmação do pedido |
| `src/pages/Home/`, `Login/`, `Register/`, `Checkout/` | Entrada pública, acesso, cadastro e demonstração dos planos |
| [src/services/parse/](src/services/parse/) | Acesso ao SDK e conversão de objetos Parse em dados tipados para a interface |
| [src/services/environments.ts](src/services/environments.ts) | Leitura e validação das três variáveis públicas do Parse |
| [src/types/domain.ts](src/types/domain.ts) | Tipos de usuário, empresa, catálogo, carrinho e pedidos |
| [src/hooks/useCart.tsx](src/hooks/useCart.tsx) | Contexto do carrinho e persistência no navegador |
| [src/hooks/usePedidos.ts](src/hooks/usePedidos.ts) | Consulta e alteração de status compartilhadas pelas telas administrativas |
| `src/components/` | Navegação, formulários, imagens, tabelas, gráficos e controles reutilizáveis |
| `src/assets/` e `public/` | Imagens e logos SVG da marca; CSS, fontes e scripts estáticos |
| [backend/src/server.js](backend/src/server.js) | Inicialização da API, índices únicos, saúde e encerramento do processo |
| [backend/src/config.js](backend/src/config.js) | Ambiente, adaptador de arquivos, limites e opções de segurança do Parse |
| [backend/src/schema.js](backend/src/schema.js) | Classes, campos, ponteiros, índices e permissões de classe |
| [backend/src/cloud.js](backend/src/cloud.js) | ACLs, propriedade dos registros, validações de pedidos e uploads |
| [backend/src/order.js](backend/src/order.js) | Cálculo monetário e validação dos itens do pedido |
| [deploy/](deploy/) | Caddy, build do frontend, exemplos de ambiente, backups, restauração e timers |

`src/services/pedidos.ts` apenas reexporta funções de `src/services/parse/pedido.service.ts`; a implementação dos pedidos fica neste último arquivo.

## 5. Modelo de dados

O schema persistido é definido em `backend/src/schema.js`. Os DTOs da interface ficam em `src/types/domain.ts`; nem sempre têm a mesma estrutura do objeto armazenado.

| Classe Parse | Campos e relações principais |
|---|---|
| `_User` | Conta administrada pelo Parse: `username`, `email`, senha e campo adicional `nome` |
| `Empresa` | `id_user → _User`, `subdominio`, nome, contatos, endereço, horários, CNPJ e `logo` como `Parse.File` |
| `Categoria` | `id_empresa → Empresa`, `nome` e `imagem` como `Parse.File` |
| `Produto` | `id_categoria → Categoria`, `nome`, `descricao`, `preco` e `imagem` como `Parse.File` |
| `Pedido` | `id_empresa → Empresa`, dados do cliente, entrega, pagamento, endereço, `produtos`, `valorTotal`, `status` e `createdAt` |

Há uma empresa por proprietário e um `subdominio` único, garantidos também por índices únicos no PostgreSQL. Produtos chegam à empresa através da categoria. Não adicione um campo paralelo `id_empresa` em `Produto` sem planejar a mudança do contrato.

Em `Pedido`, o endereço é gravado em campos diretos (`cep`, `uf`, `cidade`, `logradouro`, `bairro`, `numero`), embora a entrada do serviço use um objeto `endereco`. `produtos` contém uma cópia dos dados de cada item no momento do pedido, incluindo ID, quantidade, nome, descrição, imagem e preço. Não é uma relação Parse com produtos vivos do catálogo.

Os preços persistidos e os DTOs usam números em reais. O backend converte para centavos inteiros durante o cálculo e volta para reais ao salvar. Valores formatados como `R$ 12,50` pertencem apenas à apresentação.

Os valores aceitos são:

- **Status:** `novo`, `em andamento`, `pronto`, `em transporte`, `finalizado`, `cancelado`.
- **Pagamento:** `dinheiro`, `debito`, `credito`, `pix`.
- **Entrega:** `mesa`, `buscar`, `delivery`.

Essas listas aparecem no frontend (`domain.ts`) e no backend (`order.js`). Uma mudança exige atualizar os dois lados. O backend valida se o status pertence à lista, mas ainda não define uma sequência obrigatória de transições.

## 6. Fluxos e regras que precisam ser preservados

### Cadastro e autenticação

[auth.service.ts](src/services/parse/auth.service.ts) centraliza login, logout e cadastro. `registerOwner` cria primeiro o usuário e depois a empresa vinculada, derivando seu subdomínio do nome de usuário.

As duas gravações não são uma transação: se a empresa falhar, a conta pode já existir. Não repita o cadastro presumindo que nada foi salvo; investigue a empresa vinculada e o erro retornado.

`PrivateRoute` controla a navegação da interface. A autorização efetiva é aplicada pelas permissões de classe, ACLs e Cloud Code no servidor. O Parse administra senhas e sessões; não crie contas por inserção SQL direta.

### Catálogo e imagens

Os serviços de empresa, categoria e produto montam queries e ponteiros, fazem uploads e retornam DTOs. A leitura do catálogo é pública; alterações exigem o proprietário. O vínculo com o proprietário/empresa/categoria não pode ser transferido pelo cliente. Uma categoria com produtos não pode ser excluída.

Uploads aceitam PNG, JPEG, GIF e WebP de até 5 MB, com usuário autenticado. O servidor confere extensão e assinatura do arquivo. SVG é usado nos assets internos da aplicação, mas não é aceito como upload do usuário. Os arquivos ficam no volume `parse_files`; guardar apenas o PostgreSQL não preserva as imagens.

### Carrinho e criação do pedido

1. `useCart` mantém o carrinho em React e em `localStorage`, na chave `@MenuZap:cart`, validando os dados recuperados.
2. A página `client/Cart/NewPedido` coleta dados do cliente, entrega e pagamento.
3. `createPedido` encontra a empresa pelo subdomínio, cria o objeto Parse e envia os itens. Os cálculos feitos pelo navegador são provisórios.
4. O `beforeSave` de `Pedido` consulta o catálogo, verifica a empresa de cada produto e valida os campos obrigatórios da entrega.
5. `order.js` rejeita itens repetidos, produtos de outra empresa e quantidades inválidas; usa preços do catálogo para recalcular o total.
6. O servidor força o status inicial `novo` e uma ACL privada do proprietário. A interface recebe o ID, limpa o carrinho e mostra a confirmação.

O servidor aceita até 100 itens distintos, quantidades inteiras de 1 a 999 e total de até R$ 1.000.000. Após a criação, somente o proprietário pode atualizar o pedido e apenas o campo `status` pode mudar. A exclusão de pedidos está bloqueada.

### Consultas administrativas e permissões

`usePedidos` carrega os pedidos da empresa do usuário autenticado e alimenta dashboard, gestão e relatórios. Atualizações de status são persistidas antes de alterar a lista local. Não há polling nem assinatura em tempo real; novos pedidos aparecem após uma nova consulta, por exemplo ao recarregar a página.

| Recurso | Leitura | Escrita |
|---|---|---|
| Usuário | Privada para o próprio usuário | Cadastro público; atualização do próprio usuário |
| Empresa | Pública, com CNPJ protegido | Proprietário; exclusão desabilitada |
| Categoria e produto | Pública | Proprietário; exclusão de categoria exige ausência de produtos |
| Pedido | Proprietário do estabelecimento | Visitante cria; proprietário altera somente status; sem exclusão |

Schemas estão bloqueados para mudanças pelo cliente. O servidor também aplica limites de requisições em login, cadastro e pedidos. A master key é restrita a acesso interno e seus headers são removidos pelo Caddy público.

## 7. Rotas para orientar a navegação

A lista completa fica em [src/routes.tsx](src/routes.tsx).

| Rotas | Acesso e função |
|---|---|
| `/`, `/login`, `/register`, `/checkout` | Públicas: apresentação, login, cadastro e checkout demonstrativo |
| `/dashboard`, `/profile` | Autenticadas: indicadores e perfil do estabelecimento |
| `/categoria`, `/categoria/new`, `/categoria/edit/:idCategoria` | Autenticadas: manutenção de categorias |
| `/categoria/:idCategoria/produto` e sufixos `/new`, `/edit/:idProduto` | Autenticadas: manutenção de produtos |
| `/pedidos/admin`, `/relatorios` | Autenticadas: gestão e consulta de pedidos |
| `/:subdominio/menu`, `/:subdominio/menu/item/:id`, `/:subdominio/empresa` | Públicas: catálogo, produto e empresa |
| `/:subdominio/cart`, `/:subdominio/newpedido`, `/:subdominio/pedidos` | Públicas: carrinho, envio e confirmação |

As rotas públicas de catálogo e pedidos compartilham o `CartProvider`. Rotas desconhecidas redirecionam para `/`. A aplicação usa caminhos no navegador, por isso o servidor de arquivos precisa do fallback para `index.html`, já configurado no Caddy.

## 8. Como implementar uma mudança

### Adicionar ou alterar um campo

1. Declare o campo em `backend/src/schema.js` e defina sua validação e autorização em `cloud.js`.
2. Atualize o tipo de domínio e o mapeamento no serviço correspondente em `src/services/parse/`.
3. Atualize o formulário ou a tela que consome o DTO, incluindo estados de erro, vazio e carregamento quando aplicáveis.
4. Verifique dados existentes e planeje a migração se houver mudança de tipo ou significado. A inicialização não apaga campos extras nem recria campos modificados automaticamente.
5. Recompile o backend e valide persistência e isolamento entre dois estabelecimentos.

### Alterar uma funcionalidade existente

| Mudança | Comece por |
|---|---|
| Login, sessão ou cadastro | `auth.service.ts`, páginas `Login`/`Register` e regras de `_User`/`Empresa` |
| Perfil, categorias ou produtos | Serviço Parse correspondente, página administrativa e schema/Cloud Code |
| Preço, quantidade ou regras de pedido | `backend/src/order.js`, `cloud.js`, tipos e `pedido.service.ts` |
| Dashboard ou relatórios | `usePedidos.ts` e componentes que recebem `pedidos` |
| Navegação ou acesso a uma página | `routes.tsx`, `PrivateRoute.tsx` e componentes de menu |
| Planos demonstrativos | `src/constants/subscriptionPlans.ts` e `src/pages/Checkout/` |
| Identidade visual | `src/assets/images/logo*.svg`, `Nav`, `Menu`, `Footer` e `FooterGer` |

Mantenha o acesso ao SDK nos serviços e regras de autorização no servidor. Prefira os componentes MUI e os padrões de formulário já usados, como `ProductForm`, `ProfileForm` e `ImagePicker`. Funções utilitárias de apresentação e erros ficam em `src/util/`.

Os novos testes devem verificar comportamento e riscos da alteração. Para regras de propriedade ou pedidos, teste também adulteração de dados e acesso por outro estabelecimento; um mock do SDK não comprova essas proteções.

## 9. Verificações e testes

Após instalar as dependências com `npm ci` na raiz e `npm ci --prefix backend`:

| Comando | O que verifica |
|---|---|
| `npm test` | Testes do frontend com Vitest; arquivos `src/**/*.test.{ts,tsx}` |
| `npm run typecheck` | Tipagem estrita do frontend, sem emitir arquivos |
| `npm run build` | Build de produção em `dist/` |
| `npm test --prefix backend` | Testes unitários de regras monetárias, itens e configuração |
| `npm run test:integration --prefix backend` | API Parse real com PostgreSQL, permissões, arquivos e restauração |
| `npm run analyze` | Build com relatórios `dist/stats.html` e `dist/stats.json` |

O build local da raiz e o typecheck são comandos separados; o Dockerfile do frontend executa ambos. Não existe script de lint configurado atualmente.

A suíte de frontend cobre renderização inicial, botão, máscaras, carrinho, serviços de autenticação/catálogo/pedidos e validação do checkout. A suíte de integração cobre dois estabelecimentos e um visitante, ACLs, preços adulterados, persistência após reinício e restauração de banco e imagens.

Para integração, configure `TEST_DATABASE_URI` com um **banco exclusivo de testes**, inicialmente vazio e com nome começando em `menuzap_test`. São necessários Node 24, PostgreSQL acessível, usuário com `CREATEDB`, `pg_dump`/`pg_restore` 17 ou superior, tar e GnuPG. A suíte cria um banco temporário para restaurar o backup; não use o banco da aplicação.

```bash
TEST_DATABASE_URI='postgres://USUARIO:SENHA@HOST:PORTA/menuzap_test' npm run test:integration --prefix backend
```

Substitua os valores pelo ambiente de testes. O Compose local não expõe PostgreSQL ao host; esse comando pressupõe que você preparou um banco de testes acessível. Veja detalhes no [guia de testes](deploy/README.md#testes).

Para uma primeira verificação manual, repita o fluxo da seção 2 com dois proprietários e um visitante, incluindo upload de imagem, criação de pedido, mudança de status e tentativa de acesso cruzado.

## 10. Diagnóstico rápido

| Sintoma | Onde verificar |
|---|---|
| Alteração não aparece em `localhost:8080` | Recompile o serviço; essa porta serve o build do Docker. Para editar a interface com recarregamento automático, use o Vite em 5173 |
| Variável `VITE_PARSE_*` ausente ou API errada | Confira `.env.local` e reinicie o Vite; no Docker, confira os argumentos de build do Compose |
| Conta existe, mas perfil/empresa não aparece | O cadastro tem duas gravações. Verifique se a criação da empresa falhou e sua relação `id_user` |
| Pedido rejeitado após trocar de loja ou ambiente | O carrinho pode conter IDs antigos ou de outra empresa. Remova os itens e monte um novo pedido |
| Novo campo rejeitado | Atualize schema, validação e serviço e recompile o backend |
| Imagem não carrega | Confira `PUBLIC_ORIGIN`, logs e volume `parse_files`; no navegador a URL deve apontar para a origem pública, não para `backend:1337` |
| Banco não aceita a senha após editar configuração | A senha de um volume PostgreSQL existente não muda apenas por editar o Compose/ambiente |

`/healthz` verifica conexão com PostgreSQL dentro do container do backend. O Caddy não publica essa rota como endpoint de saúde externo; use `docker compose ... ps` e os logs para acompanhar a stack.

## 11. Limites atuais e próximos cuidados

- **Escala das consultas:** categorias e produtos têm limite de 200 por consulta; pedidos, 1.000. Dashboard e relatórios processam a lista no navegador e podem representar apenas esse recorte. Paginação e agregações no servidor são trabalho futuro.
- **Carrinho por estabelecimento:** há uma única chave local de carrinho, sem separação por empresa. O backend impede pedidos com produtos de outra empresa, mas a experiência de troca de loja pode ser melhorada.
- **Cadastro parcial:** usuário e empresa ainda precisam de um fluxo atômico ou de recuperação mais robusto.
- **Comunicação com o cliente:** não há acompanhamento público de pedidos, notificações ou geração de QR Code implementada. O caminho do cardápio pode ser compartilhado diretamente.
- **Recuperação de senha:** não há fluxo de recuperação nem adaptador de e-mail configurado.
- **Cobrança:** cadastro via checkout funciona como demonstração; pagamentos, assinaturas e controle de acesso por plano exigem implementação própria.
- **Operação:** os arquivos de implantação e backup estão versionados; sua presença não significa que uma VPS, destino externo ou agendamento já esteja configurado. A arquitetura tem uma única instância de API e banco.

Esses pontos descrevem o código atual, sem atribuir uma porcentagem de conclusão ao produto.

## 12. Produção e documentos de referência

[compose.yaml](compose.yaml) é a stack de produção. O serviço web usa o perfil `web`, recebe domínio e configurações de `deploy/stack.env`, e o Caddy entrega HTTPS. Não reutilize as credenciais locais nesse ambiente.

Banco e arquivos precisam ser incluídos no backup. Os scripts em `deploy/scripts/` implementam backup criptografado, cópia para outro equipamento, restauração e ensaio em ambiente isolado. Os timers em `deploy/systemd/` dependem de instalação e configuração no servidor. Siga o [guia operacional](deploy/README.md) para executar esses procedimentos.

Ao começar uma tarefa, leia o serviço correspondente no frontend e as regras da mesma classe no backend antes de editar a tela. Use este Markdown como referência atual; o arquivo `ANALISE.pdf` é uma exportação anterior e não foi sincronizado com esta revisão.
