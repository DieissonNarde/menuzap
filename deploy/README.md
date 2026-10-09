# Parse Server próprio com PostgreSQL

Esta stack inicia uma aplicação Parse nova. Não importa usuários, senhas, sessões, catálogo, pedidos ou arquivos do Back4App. O frontend mantém o SDK Parse e seus DTOs; validações e isolamento dos estabelecimentos são aplicados no servidor.

## Componentes e pré-requisitos

- Node 24.14.1, Parse Server 9.10.0, SDK Parse 8.6.0 e adaptador filesystem 3.0.0.
- PostgreSQL 17/PostGIS 3.5 e Caddy 2.10.2. Imagens base fixadas por digest; atualizar tag e digest juntos, após homologar.
- VPS Linux **amd64** com Docker Engine e Compose, domínio apontando para o IP e portas 80/443 disponíveis. A imagem PostGIS fixada é amd64; não usar esta stack inalterada em uma VPS ARM.
- Para backups: Bash, GNU coreutils/tar, Git, GnuPG, rsync, OpenSSH e flock no host; acesso SSH não interativo a outro equipamento.

Apenas Caddy publica portas em produção. PostgreSQL está em rede interna; a API não publica 1337. A `masterKey` é aceita apenas por localhost no backend e seus headers são removidos pelo proxy público. Nunca use a `masterKey` em variáveis `VITE_*`.

## Desenvolvimento local

### Projeto completo em containers

Na raiz do projeto, com Docker Engine e Docker Compose instalados:

```bash
docker compose -f compose.local.yaml up -d --build --wait
```

Abra **http://localhost:8080**. O frontend é compilado no Docker e servido pelo Caddy, que encaminha `/parse` para o backend. Não é necessário instalar Node/npm no host, criar `deploy/stack.env` ou configurar `.env.local`. Os arquivos de ambiente existentes do frontend não são copiados para o build. As credenciais locais já estão definidas no Compose; a master key fica apenas no backend.

Use esse arquivo sozinho, sem combinar com `compose.yaml`. O projeto Compose `menuzap-local` tem seus próprios volumes de banco e imagens. Apenas o frontend publica porta, restrita a `127.0.0.1`; API e banco são acessíveis entre containers. As credenciais fixas são para desenvolvimento local.

```bash
# Estado e logs
docker compose -f compose.local.yaml ps
docker compose -f compose.local.yaml logs -f backend

# Parar sem apagar banco nem imagens
docker compose -f compose.local.yaml down
```

O primeiro build baixa as imagens e instala as dependências. Após editar o código, repita `up -d --build --wait`; este modo serve o build e não tem recarregamento automático. Para mudar a porta, execute `MENUZAP_LOCAL_PORT=8081 docker compose -f compose.local.yaml up -d --build --wait` e acesse `http://localhost:8081`. A porta também atualiza a URL da API e das imagens; mantenha o mesmo valor nos comandos seguintes. Se o Docker negar acesso ao socket, execute com `sudo` conforme a configuração da sua instalação.

Cadastre uma conta nova com senha de pelo menos 10 caracteres. Os dados do Back4App não são importados. O Compose continua usando a imagem PostGIS amd64 fixada na stack de produção.

### Backend no Docker e frontend no host, com Vite

Mantenha a stack `compose.local.yaml` em execução. Com Node 24 instalado no host, crie `.env.local` na raiz:

```dotenv
VITE_PARSE_APPLICATION_ID=menuzap-local
VITE_PARSE_JAVASCRIPT_KEY=menuzap-local-public-key
VITE_PARSE_SERVER_URL=http://localhost:8080/parse
```

```bash
npm ci
npm run dev
```

O frontend Vite fica em `http://localhost:5173` e usa a API da stack via Caddy. Ajuste a URL em `.env.local` se mudar `MENUZAP_LOCAL_PORT`. Apenas as chaves públicas entram no frontend.

Para desenvolver o backend sem container, instale suas dependências com `npm ci --prefix backend` e execute `backend/src/server.js` no Node 24 com `DATABASE_URI`, `PARSE_APPLICATION_ID`, `PARSE_JAVASCRIPT_KEY`, `PARSE_MASTER_KEY`, `PUBLIC_ORIGIN` e opcionalmente `FILES_DIRECTORY`/`PORT` configurados. Use `NODE_ENV=development` para HTTP local.

## Regras e compatibilidade

Os schemas de `_User`, `Empresa`, `Categoria`, `Produto` e `Pedido` são declarados em `backend/src/schema.js`. Campos existentes são preservados; alterações destrutivas automáticas estão desativadas. O cliente não pode criar classes ou campos novos. Índices de consultas são versionados no schema; índices únicos de subdomínio e proprietário são instalados antes da API aceitar requisições. Não escreva diretamente nas tabelas Parse via SQL.

- `_User`: privado; cadastro público, login/logout pelo Parse; senha entre 10 e 128 caracteres. Não há adaptador de email configurado nem fluxo novo de recuperação de senha.
- `Empresa`: leitura pública dos dados comerciais; CNPJ visível só ao proprietário. Criação vinculada ao usuário autenticado; alteração só pelo proprietário; uma empresa por proprietário e um estabelecimento por subdomínio. Exclusão pela API desativada.
- `Categoria`/`Produto`: leitura pública; criação, alteração e exclusão só pelo proprietário. Ponteiros para empresa/categoria não podem ser transferidos. Categoria com produtos não pode ser excluída.
- `Pedido`: criação pública validada; leitura e alteração de status só pelo proprietário. Exclusão desativada. Cliente não recebe leitura pública do pedido; a confirmação atual usa o ID retornado no envio.
- O servidor busca produtos reais, verifica empresa/categoria, substitui os dados enviados por snapshots do catálogo, calcula em centavos e grava os DTOs atuais em reais. Aceita até 100 itens distintos, quantidade inteira de 1 a 999 por item e total até R$ 1.000.000. O status inicial é sempre `novo`; depois só o campo `status` pode ser alterado, usando os valores já existentes na aplicação.
- Imagens públicas PNG/JPEG/WebP/GIF de até 5 MB; upload autenticado, com conferência de assinatura e extensão. SVG e URLs externas não são aceitos. O diretório configurado em `FILES_DIRECTORY` é o armazenamento real do volume, não o filesystem efêmero do container.

Cadastro de usuário e empresa continua sendo composto por duas gravações, como no frontend atual. Em falha na segunda gravação, o usuário pode existir sem empresa: reparar a empresa vinculada a esse usuário pela operação administrativa interna antes de liberar sua conta. A mudança de banco não torna essas gravações atômicas.

## Testes

```bash
npm test
npm run typecheck
npm run build
npm ci --prefix backend
npm test --prefix backend
```

Para integração, use um PostgreSQL **exclusivo de testes**, banco vazio cujo nome comece com `menuzap_test`, Node 24, `pg_dump`/`pg_restore` da versão 17 ou superior, tar e GnuPG. O usuário de teste precisa de `CREATEDB` para o ensaio de restauração. O teste cria registros, reinicia a API e cria/remove um banco temporário; nunca aponte para produção.

```bash
createdb -h localhost -U menuzap menuzap_test
TEST_DATABASE_URI=postgres://menuzap:SENHA@localhost:5432/menuzap_test npm run test:integration --prefix backend
```

A suíte HTTP exercita cadastro/login/logout, perfil, catálogo, upload, dois estabelecimentos e visitante, ACLs adulteradas, preços e quantidades adulterados, unicidade, schemas bloqueados, reinício do backend e backup criptografado de banco/imagens restaurado em banco e diretório vazios. A senha no exemplo é ilustrativa; use um usuário local de teste.

## Homologação e publicação

Em uma VPS de homologação, clone o projeto em `/opt/menuzap` e prepare o ambiente:

```bash
cp deploy/stack.env.example deploy/stack.env
chmod 600 deploy/stack.env
openssl rand -hex 32
```

Gere três valores distintos para `POSTGRES_PASSWORD`, `PARSE_JAVASCRIPT_KEY` e `PARSE_MASTER_KEY` e preencha `deploy/stack.env`. Use senha PostgreSQL hexadecimal, pois ela integra uma URL. Mantenha um application ID diferente do Back4App e configure `SITE_ADDRESS=menu.seudominio.com` / `PUBLIC_ORIGIN=https://menu.seudominio.com`. Depois execute:

```bash
docker compose --env-file deploy/stack.env --profile web config --quiet
docker compose --env-file deploy/stack.env --profile web up -d --build --wait
```

O build do frontend recebe apenas application ID, JavaScript key e URL pública. Não copia o `.env` antigo e não incorpora a `masterKey`. Caddy obtém/renova o certificado automaticamente. A aplicação deve abrir também em rotas internas, por exemplo `/login` e `/loja/menu`.

Antes do corte, cadastre dois estabelecimentos, configure seus perfis e imagens, faça pedidos como visitante e verifique o isolamento. Execute um backup e um ensaio completo de restauração. Só então publique a configuração de produção. Usar novo application ID exige novo login; limpe o carrinho antigo (`@MenuZap:cart`) no navegador, pois seus produtos pertencem à aplicação anterior. Não reutilize as chaves do Back4App.

O banco começa vazio, portanto o retorno ao Back4App não replica pedidos feitos na nova stack. Após aceitar escritas reais, uma reversão requer preservar/reconciliar esses dados; não basta trocar a URL. Mantenha a aplicação antiga intacta durante a homologação.

## Backup diário e restauração mensal

O backup pausa o backend por alguns instantes para manter banco e arquivos consistentes. Durante a pausa, o cardápio estático pode abrir, mas requisições à API ficam indisponíveis. A API é reativada antes da transferência remota; erros durante a coleta também tentam reativá-la.

```bash
cp deploy/backup.env.example deploy/backup.env
openssl rand -hex 32 > deploy/backup.key
chmod 600 deploy/backup.env deploy/backup.key
```

Preencha os caminhos absolutos, usuário/host remoto e diretório remoto. As unidades systemd rodam como root por padrão: prepare a chave SSH e verifique a chave de host desse usuário previamente. Os scripts usam `BatchMode=yes` e não ignoram a verificação do host. Execute os comandos operacionais com o mesmo usuário das unidades, para manter acesso ao lock e aos backups. Guarde a chave de criptografia, as credenciais da stack e os arquivos de configuração também fora da VPS.

```bash
sudo bash deploy/scripts/backup.sh
sudo bash deploy/scripts/verify-restore.sh
```

O backup contém `database.dump`, `files.tar`, checksums e metadados em um pacote GPG/AES-256. A transferência é via rsync/SSH, com retenção de aproximadamente 30 dias local e remota, removendo backups antigos só após transferência bem-sucedida. Um lock impede backup e restauração simultâneos. Arquivos `.partial` não são considerados backups concluídos.

O ensaio usa o projeto Docker reservado `menuzap-restore-check`, com volumes/redes próprios e sem portas públicas. Restaura o último backup local, verifica consultas de todas as classes e compara cada imagem servida byte a byte. Ao terminar, remove **somente os volumes desse projeto de ensaio**. Não use esse nome para produção. O host precisa ter espaço para uma cópia adicional do banco/arquivos; o ensaio não comprova que o equipamento remoto continua acessível, por isso acompanhe também as transferências diárias.

Para ativar os agendamentos no host, após validar os scripts e os caminhos `/opt/menuzap`:

```bash
sudo install -m 644 deploy/systemd/menuzap-backup.* deploy/systemd/menuzap-restore-check.* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now menuzap-backup.timer menuzap-restore-check.timer
systemctl list-timers 'menuzap-*'
```

O backup roda diariamente às 03:00 e o ensaio no primeiro dia do mês às 04:00, no fuso `America/Porto_Velho`. As unidades são específicas do servidor da aplicação, não customizações do desktop.

Restauração real, em ambiente limpo ou com substituição deliberada dos dados atuais:

```bash
sudo bash deploy/scripts/restore.sh /caminho/menuzap-AAAAMMDDTHHMMSSZ.tar.gpg --replace-data
```

O comando autentica/descriptografa o backup e verifica checksums antes de substituir dados; recria o banco e substitui as imagens do projeto selecionado. Depois inicia o backend e aguarda saúde. Se a restauração falhar, mantém o backend parado. Reutilize application ID e credenciais do backup para preservar referências de arquivos e sessões. Em outro domínio, valide/regrave URLs públicas de arquivos e snapshots antigos antes de retomar o tráfego.

## Operação e limites

```bash
docker compose --env-file deploy/stack.env ps
docker compose --env-file deploy/stack.env logs --tail 100 backend
journalctl -u menuzap-backup.service -u menuzap-restore-check.service --since yesterday
systemctl --failed
```

Monitore saúde dos containers, espaço em disco, uso de memória, expiração dos backups e falhas das duas unidades. `/healthz` verifica o PostgreSQL internamente e não é publicado pelo Caddy. Restrinja acesso administrativo e retenção dos logs; os triggers não registram o corpo dos pedidos.

A stack tem uma instância de API/banco e não oferece alta disponibilidade. Os limites atuais de listagem do frontend (200 itens de catálogo e 1.000 pedidos) continuam existindo; PostgreSQL não os remove. Relatórios continuam calculados no frontend e não há promessa de ganho de desempenho. Atualizações precisam de backup prévio e homologação, mantendo schema, código e lockfile compatíveis. Alterar `POSTGRES_PASSWORD` no arquivo de ambiente não modifica a senha de um banco já inicializado: a rotação deve atualizar a role no PostgreSQL e a configuração em conjunto.
