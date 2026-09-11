# Menu Zap

Aplicação de cardápio digital com uma área pública para clientes e um painel de gerenciamento para estabelecimentos.

O projeto foi migrado do Create React App para Vite e atualmente usa React 19 e TypeScript em modo estrito. O backend continua sendo o Parse/Back4App.

## Requisitos

- Node.js 24 (recomendado; consulte `.nvmrc`)
- npm 11 ou superior

## Configuração

Crie o arquivo local de ambiente a partir do exemplo e preencha os dados da aplicação Parse:

```bash
cp .env.example .env.local
npm install
npm run dev
```

O servidor de desenvolvimento fica disponível em `http://localhost:5173`.

As variáveis `VITE_*` são incorporadas ao bundle do navegador. A segurança dos dados deve ser configurada no Parse usando ACLs e permissões de classe; as variáveis não substituem essas regras.

## Scripts

| Comando | Função |
|---|---|
| `npm run dev` | Inicia o Vite em desenvolvimento |
| `npm run build` | Gera a aplicação de produção em `dist/` |
| `npm run analyze` | Gera o build e os relatórios interativos do bundle em `dist/stats.html` e `dist/stats.json` |
| `npm run preview` | Serve localmente o build de produção |
| `npm test` | Executa a suíte com Vitest |
| `npm run typecheck` | Verifica os arquivos TypeScript em modo estrito, sem gerar saída |

## Stack atual

- React 19.2
- Vite 8.2
- Material UI 9.4 (com `@mui/lab` 9 beta)
- React Router 7.18 (rotas declarativas aninhadas)
- Parse SDK 8.6
- TypeScript 7 em modo estrito
- Vitest 4.1 e React Testing Library 16

## Organização da camada de dados

As páginas e os componentes não acessam mais o SDK Parse diretamente. A integração está concentrada em `src/services/parse`:

- `client.ts`: inicialização única e configuração do SDK;
- `auth.service.ts`: login, logout, sessão e cadastro do proprietário;
- `empresa.service.ts`: consulta e atualização da empresa;
- `categoria.service.ts` e `produto.service.ts`: operações do catálogo;
- `pedido.service.ts`: criação, listagem e atualização de pedidos;
- `file.service.ts`: upload de arquivos.

Os DTOs compartilhados de usuário, empresa, categoria, produto, carrinho e pedido ficam em `src/types/domain.ts`. Valores monetários permanecem numéricos na camada de dados e só são formatados na apresentação.

## Estado da modernização

Concluído nesta fase:

- substituição do `react-scripts` por Vite;
- nova entrada React com `createRoot`;
- configuração do Parse por variáveis de ambiente;
- inicialização única do Parse fora da declaração de rotas;
- criação de uma camada de serviços tipada para autenticação, empresa, categorias, produtos, pedidos e arquivos;
- remoção de imports diretos do SDK Parse das páginas e dos componentes;
- criação dos tipos de domínio para usuário, empresa, categoria, produto, carrinho e pedido;
- configuração do TypeScript em modo estrito e inclusão do comando `npm run typecheck`;
- atualização das dependências incompatíveis com React 19;
- remoção de Next.js, Rebass, Web Vitals e dependências legadas sem uso;
- atualização e limpeza do lockfile npm;
- correção dos efeitos que faziam consultas ao Parse em loop;
- atualização do React Router 5 para a API moderna do React Router 7 (`Routes`, `Navigate`, `useNavigate` e `Outlet`);
- carregamento sob demanda das páginas com `React.lazy`/`Suspense`, reduzindo o bundle inicial;
- migração dos estilos dos componentes básicos para `sx`/`GlobalStyles`;
- migração dos menus administrativo e público para `sx`, removendo JSS desses componentes compartilhados;
- migração das telas de checkout, autenticação, dashboard, relatórios, perfil, categorias, produtos e carrinho para `sx`;
- atualização do Material UI 5 para 9.4, incluindo a migração oficial dos props legados do `Grid` para `size`;
- imports individuais dos componentes MUI e dos ícones, preservando o tree-shaking;
- divisão do fornecedor em chunks de React, MUI core, ícones MUI e Recharts;
- carregamento sob demanda dos widgets do dashboard, mantendo gráficos fora do carregamento das demais telas;
- extração do item do carrinho para um componente independente e remoção de `styled-components`/`polished` dessa tela;
- divisão das telas maiores de perfil e novo pedido em seções independentes (`BusinessHours`, `AddressFields`, `CustomerFields` e `OrderOptions`);
- separação da gestão de pedidos entre o hook de dados `usePedidos` e a tabela puramente visual `PedidosTable`;
- conversão do carrinho, gestão de pedidos e widgets do dashboard para componentes TypeScript tipados;
- conversão do bootstrap, aplicação, rotas, proteção administrativa, login, cadastro e menus compartilhados para TypeScript;
- tipagem dos campos mascarados, diálogo de confirmação, botão e título compartilhados;
- tipagem do cardápio público, detalhes da empresa, detalhes do produto e formulário de criação do pedido;
- conversão do CRUD administrativo de categorias e produtos e da tela de relatórios para TypeScript;
- extração dos componentes tipados e reutilizáveis `ImagePicker` e `ProductForm`, separando apresentação e envio de dados;
- reutilização do hook `usePedidos` nos relatórios, com estados explícitos de carregamento, erro, envio e exclusão;
- conversão do perfil e de seus campos de endereço e horários para TypeScript, separando `ProfileForm` da consulta e persistência;
- conversão da página inicial, planos, navegação, cabeçalho e rodapés para componentes funcionais TypeScript;
- conversão completa do checkout para TypeScript, preservando explicitamente sua cobrança demonstrativa sem processamento ou persistência de cartão;
- vinculação do plano selecionado ao checkout, com resumo e total demonstrativo coerentes e mascaramento do número do cartão;
- conversão dos testes restantes para TypeScript e remoção do modo transitório `allowJs`;
- substituição dos estados ambíguos de empresa/produto por estados explícitos de carregamento, sucesso e erro;
- persistência do carrinho exclusivamente na chave local `@MenuZap:cart`;
- validação estrutural do carrinho recuperado do `localStorage` e limpeza após a conclusão do pedido;
- correção dos filtros e datas de relatórios/pedidos, com carregamento e atualização persistidos no Parse;
- persistência dos dados de cadastro do checkout e dos pedidos feitos pelo cliente;
- criação conjunta do usuário e de sua empresa, com subdomínio inicial derivado do nome de usuário;
- redirecionamento do cadastro concluído para o painel e remoção do link de recuperação de senha sem implementação;
- substituição dos pedidos fictícios do dashboard por dados reais vindos do serviço;
- substituição da tela pública fictícia de pedidos por uma confirmação vinculada ao pedido criado;
- tratamento de desmontagem em consultas assíncronas, evitando atualizações de estado após a troca de rota;
- correção da navegação do botão de pedido e da semântica HTML da tabela do carrinho;
- substituição das confirmações nativas de exclusão por diálogos MUI reutilizáveis;
- remoção do contexto de carrinho legado, do link para a rota inexistente de QR Code e de resíduos comentados;
- remoção da dependência opcional `@mui/material-pigment-css`, que não era usada pela configuração Emotion;
- ampliação da suíte para cobrir carrinho, autenticação, catálogo, botão compartilhado e pedidos;
- inclusão do analisador `rollup-plugin-visualizer` para acompanhar o tamanho real dos chunks;
- build de produção e auditoria de dependências validados.

Os imports foram convertidos para os namespaces `@mui/*` e os estilos das telas foram migrados para `sx`, `GlobalStyles` ou estilos locais. O shell não cria mais um `ThemeProvider` vazio, evitando carregar o pacote de tema sem customização. Para investigar regressões de tamanho, execute `npm run analyze` e abra `dist/stats.html` após o build. O relatório atual separa aproximadamente `react-vendor` (229 KB), `mui-vendor` (204 KB), `mui-icons-vendor` (88 KB) e `charts-vendor` (306 KB), todos carregados em chunks independentes; o chunk de gráficos só é solicitado pelo dashboard.

## Deploy

O conteúdo de `dist/` pode ser publicado em um serviço de hospedagem estática. O servidor deve redirecionar rotas desconhecidas para `index.html`, pois a navegação é controlada pelo React Router no navegador.
