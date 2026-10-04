# Publicar a GOLD FISH na Vercel

A versão está preparada para Next.js na Vercel, com PostgreSQL em produção e SQLite para desenvolvimento local. O arquivo SQLite não serve como armazenamento persistente de pedidos nas funções da Vercel.

## 1. Criar o banco

Crie ou conecte um PostgreSQL pelo Marketplace da Vercel (por exemplo, Neon), ou use outro PostgreSQL já existente. Copie as duas URLs fornecidas pelo provedor:

| Variável | Valor |
| --- | --- |
| DATABASE_URL | URL de conexão para a aplicação; use a conexão pooled quando fornecida |
| DIRECT_URL | URL direta para aplicar migrações; se o provedor oferece uma única URL adequada, use essa mesma URL |

Não use file:./dev.db na Vercel. Use as URLs reais com SSL conforme o provedor. Para Preview, use um banco separado do Production.

## 2. Preparar o banco uma vez

Na pasta do projeto extraído:

```bash
npm ci
cp .env.vercel.example .env.production
```

Preencha DATABASE_URL e DIRECT_URL reais em .env.production, depois execute:

```bash
npm run db:deploy:production
npm run db:seed:production
```

A migração inicial está em prisma/postgresql/migrations e o seed importa os 86 produtos e suas nove categorias sem duplicar registros. Esses comandos operam no banco configurado; confirme que escolheu o banco novo da loja. Não publique .env.production.

## 3. Colocar os arquivos no GitHub

Envie o conteúdo da pasta gold-fish-ecommerce para seu repositório, incluindo package-lock.json, prisma/postgresql, data, public e vercel.json. Não envie .env, .env.production, node_modules, .next nem o arquivo SQLite.

Se a pasta gold-fish-ecommerce ficar dentro do repositório, selecione essa pasta como Root Directory na Vercel; se package.json estiver na raiz do repositório, deixe Root Directory na raiz.

## 4. Importar o projeto na Vercel

Importe o repositório em Add New → Project. Selecione Next.js, Node.js 22.x e configure as variáveis abaixo antes do deploy. vercel.json já define npm ci e npm run vercel-build; não é necessário inventar Output Directory.

Gere a senha administrativa e a chave localmente com `npm run secrets:generate`. Cole os valores somente nos ambientes escolhidos em Settings → Environment Variables.

| Variável obrigatória | Conteúdo |
| --- | --- |
| DATABASE_URL | URL real do PostgreSQL da aplicação |
| DIRECT_URL | URL direta real do PostgreSQL |
| ADMIN_PASSWORD | Senha administrativa forte gerada localmente |
| AUTH_SECRET | Chave aleatória gerada localmente |
| WHATSAPP_NUMBER | 5511940216955, contato impresso no catálogo; verifique se segue atual |
| PAYMENT_PROVIDER | none até escolher e configurar o gateway |
| NEXT_PUBLIC_BASE_URL | URL pública HTTPS do projeto |

No primeiro deploy, se ainda não souber a URL pública, deixe NEXT_PUBLIC_BASE_URL sem configurar. Depois copie a URL fornecida pela Vercel, configure a variável e faça Redeploy para corrigir sitemap/retornos. O pagamento online permanece desativado até ter a URL correta e credenciais.

O build gera o Prisma Client para PostgreSQL. Home, admin, páginas de produtos/pedidos e sitemap consultam o banco durante o uso; o build não importa produtos nem grava no banco. Migrações ficam fora do build para impedir que um Preview altere acidentalmente o banco de Production. Depois de novas alterações de schema, aplique as migrações antes do deploy correspondente.

## 5. Conferir a loja publicada

Confira home, foto de produto, categoria em nova aba, carrinho, checkout, pedido no admin e link WhatsApp. O painel está em /admin-login. Confirme preço e estoque reais antes de cobrar.

Pagamento Mercado Pago opcional: configure as variáveis descritas no README e o webhook HTTPS /api/payments/webhook. Outro gateway precisa ser identificado para completar seu adaptador. WhatsApp automático depende de API oficial e template aprovado; o botão manual abre a mensagem e o cliente confirma o envio.

## Limites da validação desta entrega

Build de produção com schema PostgreSQL concluído sem conexão externa. A migração SQL foi executada em PostgreSQL embutido local (PGlite), incluindo as 10 tabelas. Prévia e fluxo da loja testados localmente com SQLite. Não foi criado banco externo nem feito deploy real na conta Vercel; isso depende das URLs/contas fornecidas pela loja.

## Referências oficiais

- https://vercel.com/kb/guide/is-sqlite-supported-in-vercel
- https://vercel.com/docs/storage
- https://vercel.com/docs/environment-variables
- https://www.prisma.io/docs/orm/v6/prisma-client/deployment/serverless/deploy-to-vercel
