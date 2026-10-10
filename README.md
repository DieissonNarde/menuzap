# Menu Zap

Cardápio digital com catálogo público, carrinho e envio de pedidos. O painel do estabelecimento permite gerenciar perfil, categorias, produtos, imagens, pedidos e relatórios.

**Tecnologias:** React 19, TypeScript, Vite e Material UI no frontend; Parse Server 9, Node.js 24 e PostgreSQL 17/PostGIS no backend; Docker Compose e Caddy na infraestrutura.

Para começar a desenvolver, consulte o [guia para novos desenvolvedores](ANALISE.md), com arquitetura, fluxos, modelo de dados e orientações de alteração.

## Executar localmente

Requer Docker Engine e Docker Compose em uma máquina **amd64**. Na raiz do projeto:

```bash
docker compose -f compose.local.yaml up -d --build --wait
```

Acesse **http://localhost:8080**. Não é necessário instalar Node/npm ou configurar arquivos de ambiente para esse modo. O primeiro build baixa as imagens e instala as dependências.

Em um banco novo, cadastre uma conta em `/register` com senha de pelo menos 10 caracteres. O cadastro cria o usuário e sua empresa. O cardápio público fica em `/{subdominio}/menu`, com subdomínio inicialmente derivado do nome de usuário.

```bash
# Consultar serviços e acompanhar logs
docker compose -f compose.local.yaml ps
docker compose -f compose.local.yaml logs -f

# Parar, preservando banco e imagens
docker compose -f compose.local.yaml down
```

Após alterar o código, repita o comando de inicialização para recompilar. Para usar outra porta:

```bash
MENUZAP_LOCAL_PORT=8081 docker compose -f compose.local.yaml up -d --build --wait
```

Esse arquivo é independente e usa credenciais exclusivas de desenvolvimento. Caddy entrega o frontend e encaminha `/parse` ao backend; banco e API ficam na rede dos containers. Banco e imagens são persistidos em volumes.

## Contas e dados de teste

No banco local já populado, acesse [o login](http://localhost:8080/login) com uma destas contas:

| Empresa | Usuário | Senha |
|---|---|---|
| Lanchonete Menu Zap Demo | `demo-menuzap` | `Mz!s6sNPhIsTnFJsbk7` |
| MenuZap Teste | `teste-e52f5d` | `Mz!y7zIl2fta_AEENSh` |

A **Lanchonete Menu Zap Demo** possui 3 categorias, 9 produtos e 12 pedidos, com dois pedidos em cada status. Use essa conta para testar o catálogo, dashboard, gestão de pedidos e relatórios.

- [Cardápio da Lanchonete Menu Zap Demo](http://localhost:8080/menuzap-demo/menu)
- [Cardápio da empresa MenuZap Teste](http://localhost:8080/teste-e52f5d/menu)

Essas credenciais são de demonstração para o ambiente local. As contas foram cadastradas no banco desta instalação; não são criadas automaticamente pelo Compose em outro computador ou após apagar os volumes. Em um banco novo, use `/register` para criar uma conta. Com o frontend via Vite, use `http://localhost:5173/login` conectado à mesma API local.

## Desenvolver o frontend com Vite

Com a stack local em execução e **Node.js 24** instalado, crie `.env.local` com as configurações públicas do Compose local:

```dotenv
VITE_PARSE_APPLICATION_ID=menuzap-local
VITE_PARSE_JAVASCRIPT_KEY=menuzap-local-public-key
VITE_PARSE_SERVER_URL=http://localhost:8080/parse
```

```bash
npm ci
npm run dev
```

Acesse **http://localhost:5173**, com recarregamento automático. Se mudar a porta da stack, ajuste a URL da API. A master key deve permanecer exclusivamente no backend.

## Verificações

```bash
npm test
npm run typecheck
npm run build
npm ci --prefix backend
npm test --prefix backend
```

Os testes de integração exigem PostgreSQL exclusivo de testes; veja o [guia operacional](deploy/README.md#testes). Para analisar o bundle, execute `npm run analyze`.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `src/pages/` | Páginas públicas e administrativas |
| `src/components/` e `src/hooks/` | Componentes e lógica compartilhada |
| `src/services/parse/` | Autenticação, catálogo, pedidos e arquivos via SDK Parse |
| `src/types/` | Contratos e tipos de domínio |
| `backend/src/` | Servidor, schemas, permissões e validações de pedidos |
| `compose.local.yaml` | Stack completa para uso local |
| `compose.yaml` | Stack de produção |
| `deploy/` | Caddy, imagens Docker, backups e restauração |

## Produção

Consulte o [guia de implantação, backups e restauração](deploy/README.md). A produção exige domínio, HTTPS e segredos próprios. A stack inicia uma aplicação Parse nova; dados e contas do Back4App não são importados.

O checkout de planos é demonstrativo, sem processamento de pagamentos. A recuperação de senha por e-mail ainda não está configurada.
