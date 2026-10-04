# Como abrir e rodar no Codex

## 1. Abra esta pasta
Abra a pasta raiz do projeto:
`gold-fish-ecommerce`

## 2. Primeiro comando para o Codex
Cole:

> Leia o AGENTS.md e o README.md. Depois configure o ambiente local, instale as dependências, crie o .env a partir do .env.example, gere o banco Prisma, rode o seed e inicie o projeto. Corrija automaticamente erros de instalação, TypeScript, Prisma, build ou runtime que aparecerem. Não altere o objetivo do projeto nem simplifique funcionalidades já existentes.

## 3. Comandos que o Codex deve executar
```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

No Windows PowerShell, use:
```powershell
Copy-Item .env.example .env
```

## 4. Valores mínimos no .env
```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="troque-esta-senha"
AUTH_SECRET="use-uma-chave-longa-e-aleatoria"
WHATSAPP_NUMBER="5511999999999"
WHATSAPP_API_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""
NEXT_PUBLIC_STORE_NAME="Gold Fish"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## 5. Endereços
- Loja: http://localhost:3000
- Login admin: http://localhost:3000/admin-login
- Painel: http://localhost:3000/admin

## 6. Depois que estiver rodando
Peça ao Codex:

> Faça uma auditoria completa do projeto rodando localmente. Teste home, produto, carrinho, checkout, criação de pedido, persistência no banco, link do WhatsApp, login admin, painel, responsividade e build de produção. Corrija todos os erros encontrados e não pare até `npm run build` concluir com sucesso.

## 7. Depois, para evoluir o painel
Peça:

> Implemente CRUD completo no painel administrativo para produtos e categorias, incluindo criar, editar, excluir, preço promocional, estoque, SKU, descrição, imagens e status. Preserve as regras de segurança do AGENTS.md.
